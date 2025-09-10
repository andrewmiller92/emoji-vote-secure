import React from 'react';
import { Button } from './button';
import { Wallet, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useToast } from '@/hooks/use-toast';

interface RainbowWalletConnectProps {
  className?: string;
}

export const RainbowWalletConnect: React.FC<RainbowWalletConnectProps> = ({ className }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard.",
        variant: "destructive",
      });
    }
  };

  const openInExplorer = (addr: string) => {
    const explorerUrl = `https://etherscan.io/address/${addr}`;
    window.open(explorerUrl, '_blank');
  };

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  if (isConnected && address) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">
            {formatAddress(address)}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(address)}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => openInExplorer(address)}
          className="h-8 w-8 p-0"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="h-8 px-3"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        onClick={() => {
          // Try to connect with the first available connector
          const connector = connectors[0];
          if (connector) {
            handleConnect(connector);
          }
        }}
        disabled={isPending}
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      
      {connectors.length > 1 && (
        <div className="flex flex-col gap-1">
          {connectors.slice(1).map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              size="sm"
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className="justify-start"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {connector.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
