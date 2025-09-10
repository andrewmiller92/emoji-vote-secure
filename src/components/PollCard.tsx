import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Clock, Lock, Loader2 } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/use-toast';

interface PollOption {
  id: string;
  emoji: string;
  text: string;
  votes: number;
}

interface PollCardProps {
  id?: number;
  title: string;
  options: PollOption[];
  totalVotes: number;
  timeLeft: string;
  isEncrypted?: boolean;
  hasUserVoted?: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({
  id,
  title,
  options,
  totalVotes,
  timeLeft,
  isEncrypted = true,
  hasUserVoted: initialHasVoted = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [isVoting, setIsVoting] = useState(false);
  const { castVote, isLoading } = useContract();
  const { toast } = useToast();

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;

    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Invalid Poll",
        description: "Poll ID is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsVoting(true);
    try {
      // In a real implementation, this would encrypt the vote using FHE
      const encryptedVote = "0x" + Math.random().toString(16).substr(2, 64); // Mock encrypted vote
      const proof = "0x" + Math.random().toString(16).substr(2, 64); // Mock proof
      
      const tx = await castVote(id, parseInt(optionId), encryptedVote, proof);
      
      if (tx) {
        setSelectedOption(optionId);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error casting vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-poll transition-all duration-300 bg-card border-0 rounded-2xl">
      <div className="space-y-4">
        {/* Poll header */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-card-foreground leading-tight">
            {title}
          </h3>
          {isEncrypted && (
            <div className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-2 py-1 rounded-lg text-xs">
              <Lock className="w-3 h-3" />
              <span className="font-medium">FHE</span>
            </div>
          )}
        </div>

        {/* Poll options */}
        <div className="space-y-3">
          {options.map((option) => {
            const percentage = getVotePercentage(option.votes);
            const isSelected = selectedOption === option.id;
            
            return (
              <div key={option.id} className="space-y-2">
                <Button
                  variant="vote"
                  size="default"
                  onClick={() => handleVote(option.id)}
                  className={`w-full h-auto p-4 justify-start text-left ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  } ${hasVoted || isVoting ? 'pointer-events-none' : ''}`}
                >
                  <span className="text-3xl mr-3 transform hover:scale-110 transition-transform">
                    {option.emoji}
                  </span>
                  <span className="font-medium text-base flex-1">
                    {option.text}
                  </span>
                  {hasVoted && (
                    <span className="text-sm text-muted-foreground font-mono">
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                </Button>
                
                {/* Vote bar */}
                {hasVoted && (
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Poll stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}</span>
            </div>
          </div>
          
          {!hasVoted && selectedOption && (
            <Button 
              variant="emoji" 
              size="sm" 
              onClick={() => handleVote(selectedOption)}
              disabled={isVoting || isLoading}
            >
              {isVoting || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Voting...
                </>
              ) : (
                'Submit Vote 🚀'
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};