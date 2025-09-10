import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "pollId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"}
    ],
    "name": "PollCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "voteId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "pollId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "uint32", "name": "optionId", "type": "uint32"}
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string[]", "name": "_emojis", "type": "string[]"},
      {"internalType": "string[]", "name": "_texts", "type": "string[]"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"}
    ],
    "name": "createPoll",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "pollId", "type": "uint256"},
      {"internalType": "uint256", "name": "optionId", "type": "uint256"},
      {"internalType": "bytes", "name": "encryptedVote", "type": "bytes"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "castVote",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "pollId", "type": "uint256"}
    ],
    "name": "endPoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "pollId", "type": "uint256"}
    ],
    "name": "getPollInfo",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint8", "name": "totalVotes", "type": "uint8"},
      {"internalType": "uint8", "name": "optionCount", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "pollId", "type": "uint256"},
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "hasUserVoted",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address - This would be the deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

export interface PollData {
  id: number;
  title: string;
  description: string;
  totalVotes: number;
  optionCount: number;
  isActive: boolean;
  isVerified: boolean;
  creator: string;
  startTime: number;
  endTime: number;
  options: PollOption[];
}

export interface PollOption {
  id: number;
  emoji: string;
  text: string;
  votes: number;
}

export const useContract = () => {
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          console.log('Initializing contract with ethereum provider');
          
          // For now, we'll use a mock contract
          setContract({
            createPoll: async (title: string, description: string, emojis: string[], texts: string[], duration: number) => {
              // Mock implementation
              return { hash: '0x' + Math.random().toString(16).substr(2, 64) };
            },
            castVote: async (pollId: number, optionId: number, encryptedVote: string, proof: string) => {
              // Mock implementation
              return { hash: '0x' + Math.random().toString(16).substr(2, 64) };
            },
            getPollInfo: async (pollId: number) => {
              // Mock implementation
              return {
                title: `Mock Poll ${pollId}`,
                description: "This is a mock poll for testing",
                totalVotes: Math.floor(Math.random() * 100),
                optionCount: 4,
                isActive: true,
                isVerified: true,
                creator: "0x1234567890123456789012345678901234567890",
                startTime: Date.now() - 86400000, // 1 day ago
                endTime: Date.now() + 86400000 // 1 day from now
              };
            },
            hasUserVoted: async (pollId: number, user: string) => {
              // Mock implementation
              return Math.random() > 0.5;
            }
          });
        } catch (error) {
          console.error('Error initializing contract:', error);
          toast({
            title: "Contract Error",
            description: "Failed to initialize contract connection.",
            variant: "destructive",
          });
        }
      } else {
        console.log('No ethereum provider found');
      }
    };

    initializeContract();
  }, [toast]);

  const createPoll = async (
    title: string,
    description: string,
    emojis: string[],
    texts: string[],
    duration: number
  ) => {
    if (!contract) {
      toast({
        title: "Contract Not Ready",
        description: "Contract is not initialized yet.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const tx = await contract.createPoll(title, description, emojis, texts, duration);
      toast({
        title: "Poll Created",
        description: "Your poll has been created successfully!",
      });
      return tx;
    } catch (error: any) {
      console.error('Error creating poll:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create poll. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const castVote = async (
    pollId: number,
    optionId: number,
    encryptedVote: string,
    proof: string
  ) => {
    if (!contract) {
      toast({
        title: "Contract Not Ready",
        description: "Contract is not initialized yet.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const tx = await contract.castVote(pollId, optionId, encryptedVote, proof);
      toast({
        title: "Vote Cast",
        description: "Your vote has been cast successfully!",
      });
      return tx;
    } catch (error: any) {
      console.error('Error casting vote:', error);
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPollInfo = async (pollId: number): Promise<PollData | null> => {
    if (!contract) {
      return null;
    }

    try {
      const info = await contract.getPollInfo(pollId);
      return {
        id: pollId,
        title: info.title,
        description: info.description,
        totalVotes: info.totalVotes,
        optionCount: info.optionCount,
        isActive: info.isActive,
        isVerified: info.isVerified,
        creator: info.creator,
        startTime: info.startTime,
        endTime: info.endTime,
        options: [] // This would be populated separately
      };
    } catch (error) {
      console.error('Error getting poll info:', error);
      return null;
    }
  };

  const hasUserVoted = async (pollId: number, user: string): Promise<boolean> => {
    if (!contract) {
      return false;
    }

    try {
      return await contract.hasUserVoted(pollId, user);
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  };

  return {
    contract,
    isLoading,
    createPoll,
    castVote,
    getPollInfo,
    hasUserVoted,
  };
};
