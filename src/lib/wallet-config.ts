import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Emoji Vote Secure',
  projectId: 'YOUR_PROJECT_ID', // You can get this from WalletConnect Cloud
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// For development, we'll use a simple configuration without WalletConnect
export const simpleConfig = {
  appName: 'Emoji Vote Secure',
  chains: [mainnet, sepolia],
  ssr: false,
};
