import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

// Dynamically import Web3Provider with SSR disabled
const Web3Provider = dynamic(
  () => import('../components/Web3Provider').then((mod) => mod.Web3Provider),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
