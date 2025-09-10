import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Wallet, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Check for Nightly wallet first
      if (window.nightly) {
        try {
          const accounts = await window.nightly.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
            return;
          }
        } catch (error) {
          console.log('Nightly wallet not connected:', error);
        }
      }
      
      // Fallback to standard ethereum provider
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      let accounts: string[] = [];
      
      // Try Nightly wallet first
      if (window.nightly) {
        try {
          accounts = await window.nightly.request({
            method: 'eth_requestAccounts',
          });
          console.log('Connected to Nightly wallet');
        } catch (error) {
          console.log('Nightly wallet connection failed:', error);
        }
      }
      
      // Fallback to standard ethereum provider
      if (accounts.length === 0 && typeof window.ethereum !== 'undefined') {
        try {
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          console.log('Connected to standard wallet');
        } catch (error) {
          console.log('Standard wallet connection failed:', error);
        }
      }
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
      } else {
        throw new Error('No wallet found or connection failed');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Please install and unlock a Web3 wallet (MetaMask, Nightly, etc.) to continue.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyAddress}
          className={cn("flex items-center gap-2 font-mono text-xs", className)}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {formatAddress(address)}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="text-muted-foreground hover:text-foreground"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      size="sm"
      className={cn("flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-opacity", className)}
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
    nightly?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}