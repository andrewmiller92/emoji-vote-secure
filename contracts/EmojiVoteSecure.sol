// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract EmojiVoteSecure is SepoliaConfig {
    using FHE for *;
    
    struct Poll {
        euint32 pollId;
        euint32 totalVotes;
        euint32 optionCount;
        bool isActive;
        bool isVerified;
        string title;
        string description;
        address creator;
        uint256 startTime;
        uint256 endTime;
        mapping(uint256 => euint32) optionVotes;
        mapping(address => bool) hasVoted;
    }
    
    struct Vote {
        euint32 voteId;
        euint32 pollId;
        euint32 optionId;
        address voter;
        uint256 timestamp;
    }
    
    struct PollOption {
        euint32 optionId;
        string emoji;
        string text;
        euint32 voteCount;
    }
    
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => Vote) public votes;
    mapping(address => euint32) public voterReputation;
    mapping(address => euint32) public creatorReputation;
    
    uint256 public pollCounter;
    uint256 public voteCounter;
    
    address public owner;
    address public verifier;
    
    event PollCreated(uint256 indexed pollId, address indexed creator, string title);
    event VoteCast(uint256 indexed voteId, uint256 indexed pollId, address indexed voter, uint32 optionId);
    event PollVerified(uint256 indexed pollId, bool isVerified);
    event PollEnded(uint256 indexed pollId, uint32 totalVotes);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _emojis,
        string[] memory _texts,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Poll title cannot be empty");
        require(_emojis.length == _texts.length, "Emojis and texts must have same length");
        require(_emojis.length >= 2, "Poll must have at least 2 options");
        require(_duration > 0, "Duration must be positive");
        
        uint256 pollId = pollCounter++;
        Poll storage poll = polls[pollId];
        
        poll.pollId = FHE.asEuint32(0); // Will be set properly later
        poll.totalVotes = FHE.asEuint32(0);
        poll.optionCount = FHE.asEuint32(_emojis.length);
        poll.isActive = true;
        poll.isVerified = false;
        poll.title = _title;
        poll.description = _description;
        poll.creator = msg.sender;
        poll.startTime = block.timestamp;
        poll.endTime = block.timestamp + _duration;
        
        // Initialize option votes
        for (uint256 i = 0; i < _emojis.length; i++) {
            poll.optionVotes[i] = FHE.asEuint32(0);
        }
        
        emit PollCreated(pollId, msg.sender, _title);
        return pollId;
    }
    
    function castVote(
        uint256 pollId,
        uint256 optionId,
        externalEuint32 encryptedVote,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(polls[pollId].creator != address(0), "Poll does not exist");
        require(polls[pollId].isActive, "Poll is not active");
        require(block.timestamp <= polls[pollId].endTime, "Poll has ended");
        require(!polls[pollId].hasVoted[msg.sender], "Already voted");
        require(optionId < uint256(FHE.decrypt(polls[pollId].optionCount)), "Invalid option");
        
        uint256 voteId = voteCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalVote = FHE.fromExternal(encryptedVote, inputProof);
        
        votes[voteId] = Vote({
            voteId: FHE.asEuint32(0), // Will be set properly later
            pollId: FHE.asEuint32(pollId),
            optionId: FHE.asEuint32(optionId),
            voter: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update poll totals
        polls[pollId].totalVotes = FHE.add(polls[pollId].totalVotes, internalVote);
        polls[pollId].optionVotes[optionId] = FHE.add(polls[pollId].optionVotes[optionId], internalVote);
        polls[pollId].hasVoted[msg.sender] = true;
        
        emit VoteCast(voteId, pollId, msg.sender, uint32(optionId));
        return voteId;
    }
    
    function endPoll(uint256 pollId) public {
        require(polls[pollId].creator == msg.sender || msg.sender == owner, "Not authorized");
        require(polls[pollId].isActive, "Poll is not active");
        require(block.timestamp > polls[pollId].endTime, "Poll has not ended yet");
        
        polls[pollId].isActive = false;
        emit PollEnded(pollId, 0); // FHE.decrypt(polls[pollId].totalVotes) - will be decrypted off-chain
    }
    
    function verifyPoll(uint256 pollId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify polls");
        require(polls[pollId].creator != address(0), "Poll does not exist");
        
        polls[pollId].isVerified = isVerified;
        emit PollVerified(pollId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is voter or creator based on context
        if (votes[voteCounter - 1].voter == user) {
            voterReputation[user] = reputation;
        } else {
            creatorReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getPollInfo(uint256 pollId) public view returns (
        string memory title,
        string memory description,
        uint8 totalVotes,
        uint8 optionCount,
        bool isActive,
        bool isVerified,
        address creator,
        uint256 startTime,
        uint256 endTime
    ) {
        Poll storage poll = polls[pollId];
        return (
            poll.title,
            poll.description,
            0, // FHE.decrypt(poll.totalVotes) - will be decrypted off-chain
            0, // FHE.decrypt(poll.optionCount) - will be decrypted off-chain
            poll.isActive,
            poll.isVerified,
            poll.creator,
            poll.startTime,
            poll.endTime
        );
    }
    
    function getVoteInfo(uint256 voteId) public view returns (
        uint8 pollId,
        uint8 optionId,
        address voter,
        uint256 timestamp
    ) {
        Vote storage vote = votes[voteId];
        return (
            0, // FHE.decrypt(vote.pollId) - will be decrypted off-chain
            0, // FHE.decrypt(vote.optionId) - will be decrypted off-chain
            vote.voter,
            vote.timestamp
        );
    }
    
    function getOptionVotes(uint256 pollId, uint256 optionId) public view returns (uint8) {
        return 0; // FHE.decrypt(polls[pollId].optionVotes[optionId]) - will be decrypted off-chain
    }
    
    function getVoterReputation(address voter) public view returns (uint8) {
        return 0; // FHE.decrypt(voterReputation[voter]) - will be decrypted off-chain
    }
    
    function getCreatorReputation(address creator) public view returns (uint8) {
        return 0; // FHE.decrypt(creatorReputation[creator]) - will be decrypted off-chain
    }
    
    function hasUserVoted(uint256 pollId, address user) public view returns (bool) {
        return polls[pollId].hasVoted[user];
    }
    
    function getPollStatus(uint256 pollId) public view returns (
        bool isActive,
        bool isVerified,
        bool hasEnded
    ) {
        Poll storage poll = polls[pollId];
        return (
            poll.isActive,
            poll.isVerified,
            block.timestamp > poll.endTime
        );
    }
}
