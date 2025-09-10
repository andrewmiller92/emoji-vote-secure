import React from 'react';
import { EmojiHeader } from '@/components/EmojiHeader';
import { PollCard } from '@/components/PollCard';
import { CreatePollButton } from '@/components/CreatePollButton';

const Index = () => {
  // Sample poll data
  const samplePolls = [
    {
      title: "What's the best emoji for voting? 🤔",
      options: [
        { id: '1', emoji: '🗳️', text: 'Ballot Box', votes: 45 },
        { id: '2', emoji: '👍', text: 'Thumbs Up', votes: 32 },
        { id: '3', emoji: '✅', text: 'Check Mark', votes: 28 },
        { id: '4', emoji: '🎯', text: 'Target', votes: 15 },
      ],
      totalVotes: 120,
      timeLeft: '2 days left',
    },
    {
      title: "Which feature should we build next? 🚀",
      options: [
        { id: '1', emoji: '📊', text: 'Advanced Analytics', votes: 67 },
        { id: '2', emoji: '🔔', text: 'Push Notifications', votes: 43 },
        { id: '3', emoji: '🌙', text: 'Dark Mode', votes: 35 },
        { id: '4', emoji: '📱', text: 'Mobile App', votes: 89 },
      ],
      totalVotes: 234,
      timeLeft: '5 hours left',
    },
    {
      title: "Best time for team meetings? ⏰",
      options: [
        { id: '1', emoji: '🌅', text: 'Morning (9-11 AM)', votes: 25 },
        { id: '2', emoji: '☀️', text: 'Midday (12-2 PM)', votes: 18 },
        { id: '3', emoji: '🌆', text: 'Afternoon (3-5 PM)', votes: 42 },
        { id: '4', emoji: '🌙', text: 'Evening (6-8 PM)', votes: 12 },
      ],
      totalVotes: 97,
      timeLeft: '1 day left',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <EmojiHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Action section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Create & Vote Securely 🔒
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of private polling with fully homomorphic encryption. 
              Your votes remain completely confidential while still contributing to transparent results.
            </p>
            <div className="pt-4">
              <CreatePollButton />
            </div>
          </div>

          {/* Active polls section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Active Polls</h3>
              <div className="flex items-center gap-2 bg-accent/20 text-accent-foreground px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium">Live Results</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
              {samplePolls.map((poll, index) => (
                <PollCard
                  key={index}
                  title={poll.title}
                  options={poll.options}
                  totalVotes={poll.totalVotes}
                  timeLeft={poll.timeLeft}
                  isEncrypted={true}
                />
              ))}
            </div>
          </div>

          {/* Features section */}
          <div className="bg-card rounded-2xl p-8 shadow-card border-0">
            <h3 className="text-xl font-bold text-card-foreground mb-6 text-center">
              Why Choose Encrypted Polls? 🛡️
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="text-4xl">🔐</div>
                <h4 className="font-semibold text-card-foreground">Fully Private</h4>
                <p className="text-sm text-muted-foreground">
                  FHE encryption ensures your vote is never revealed, even to us.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl">📊</div>
                <h4 className="font-semibold text-card-foreground">Transparent Results</h4>
                <p className="text-sm text-muted-foreground">
                  See live results while maintaining complete voter privacy.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl">⚡</div>
                <h4 className="font-semibold text-card-foreground">Instant Voting</h4>
                <p className="text-sm text-muted-foreground">
                  Cast your encrypted vote instantly with just a tap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;