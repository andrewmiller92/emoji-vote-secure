import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Wallet, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { isWalletAvailable, waitForWallet, safeWalletRequest } from '@/utils/errorHandler';

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
      try {
        // Wait for wallet to be available
        const walletReady = await waitForWallet(3000);
        
        if (walletReady) {
          const accounts = await safeWalletRequest('eth_accounts');
          if (accounts && accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
            console.log('Wallet already connected:', accounts[0]);
          }
        }
      } catch (error) {
        // Ignore extension conflicts and other non-critical errors
        console.log('Wallet connection check completed (some extensions may have conflicts)');
      }
    };

    checkWalletConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        console.log('Account changed:', accounts[0]);
      } else {
        setIsConnected(false);
        setAddress('');
        console.log('Account disconnected');
      }
    };

    // Listen for chain changes
    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed:', chainId);
      // Optionally refresh the page or show a notification
    };

    // Add event listeners if ethereum provider is available
    if (window.ethereum) {
      try {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged as any);
      } catch (error) {
        console.log('Could not add wallet event listeners:', error);
      }
    }

    // Cleanup function
    return () => {
      if (window.ethereum) {
        try {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged as any);
        } catch (error) {
          console.log('Could not remove wallet event listeners:', error);
        }
      }
    };
  }, []);

  const connectWallet = async () => {
    // Check if wallet is available
    if (!isWalletAvailable()) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask, Nightly, or another Web3 wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Wait for wallet to be ready
      const walletReady = await waitForWallet(2000);
      if (!walletReady) {
        throw new Error('Wallet not ready');
      }
      
      // Request account access with safe wrapper
      const accounts = await safeWalletRequest('eth_requestAccounts', [], 15000);
      
      if (accounts && accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
        console.log('Wallet connected:', accounts[0]);
      } else {
        throw new Error('No accounts returned');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      let errorMessage = "Failed to connect wallet. Please try again.";
      let errorTitle = "Connection Failed";
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user.";
        errorTitle = "Connection Rejected";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending.";
        errorTitle = "Request Pending";
      } else if (error.message === 'Request timeout') {
        errorMessage = "Connection timed out. Please check your wallet and try again.";
        errorTitle = "Connection Timeout";
      } else if (error.message === 'Wallet not ready') {
        errorMessage = "Wallet extension is not ready. Please try again in a moment.";
        errorTitle = "Wallet Not Ready";
      } else if (error.message?.includes('User denied')) {
        errorMessage = "Connection was denied. Please approve the connection in your wallet.";
        errorTitle = "Connection Denied";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
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
  }
}