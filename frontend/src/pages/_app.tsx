import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig, midnightTheme } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hedera, hederaTestnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Truce',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'demo-project-id',
  chains: [mainnet, sepolia, hedera, hederaTestnet],
  ssr: true, // Enable SSR support
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
