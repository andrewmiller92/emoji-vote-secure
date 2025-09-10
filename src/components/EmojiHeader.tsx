import React from 'react';
import { RainbowWalletConnect } from './ui/rainbow-wallet-connect';
import { Shield, Lock } from 'lucide-react';

export const EmojiHeader: React.FC = () => {
  const emojis = ['🗳️', '📊', '🔒', '💡', '🎯', '🚀', '✨', '🌟'];

  return (
    <header className="w-full bg-gradient-primary text-primary-foreground relative overflow-hidden">
      {/* Animated emoji background */}
      <div className="absolute inset-0 opacity-10">
        {emojis.map((emoji, index) => (
          <div
            key={index}
            className={`absolute text-6xl animate-bounce-gentle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.3}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-bounce-gentle">🗳️</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Confidential Polls
              </h1>
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mt-1">
                <Shield className="w-4 h-4" />
                <span className="font-mono">FHE-Based Poll Security</span>
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <RainbowWalletConnect />
        </div>

        {/* Security indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-medium">End-to-End Encrypted Voting</span>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
};