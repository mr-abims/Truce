import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GettingStarted: NextPage = () => {
  const mainSections = [
    { id: 'introduction', title: 'Introduction', href: '/docs' },
    { id: 'why-truce', title: 'Why Truce', href: '/docs/why-truce' },
    { id: 'installation', title: 'Installation', href: '/docs/installation' },
    { id: 'getting-started', title: 'Getting Started', href: '/docs/getting-started' },
    { id: 'guides', title: 'Guides', href: '/docs/guides' },
    { id: 'faq', title: 'FAQ', href: '/docs/faq' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Getting Started - Documentation</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex">
        {/* Left Sidebar */}
        <aside className="h-screen sticky top-0 overflow-y-auto bg-black" style={{ width: '277px' }}>
          <div className="sidebar-block">
            <h3 className="font-roboto font-normal text-gray-400 mb-4 uppercase tracking-wider text-base">
              Docs
            </h3>
            <nav>
              {mainSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className={`block py-2 font-roboto transition-colors text-base ${
                    section.id === 'getting-started'
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {section.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 px-12 py-12 bg-gray-900 font-roboto" style={{ maxWidth: '730px' }}>
          <h1 className="text-5xl font-normal text-white mb-12">
            Getting Started
          </h1>

          <div className="space-y-16">
            <div>
              <div
                style={{
                  width: '748px',
                  height: '0px',
                  borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                  marginTop: '40px',
                  marginBottom: '40px',
                }}
              />
              <h2 className="text-2xl font-normal text-white mb-6">
                Connect Your Wallet
              </h2>
              <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
                <li>Visit the Truce platform</li>
                <li>Click &quot;Connect Wallet&quot; in the top right corner</li>
                <li>Select your wallet provider (MetaMask, HashPack, etc.)</li>
                <li>Approve the connection request in your wallet</li>
                <li>Ensure you&apos;re on the correct network (Hedera testnet)</li>
              </ol>
            </div>

            <div>
              <div
                style={{
                  width: '748px',
                  height: '0px',
                  borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                  marginTop: '40px',
                  marginBottom: '40px',
                }}
              />
              <h2 className="text-2xl font-normal text-white mb-6">
                Explore Markets
              </h2>
              <p className="mb-6 text-gray-300">
                Browse available prediction markets across different categories. We offer a wide range of markets, from crypto to politics, weather, sports, and more, to cater to a wide range of interests and expertise. Each market displays the current YES/NO probability, total liquidity, trading volume, and resolution deadline. You can filter markets by category, sort by volume or creation date, and search for specific topics or events. The market details page shows the full question, creator information, trading history, and current price chart. Take your time to understand the market conditions before making a trade—review the liquidity depth, creator reputation, and dispute history to make informed decisions. Markets with higher liquidity generally offer better pricing and lower slippage for your trades.{' '}
                <Link href="/Markets" className="hover:underline" style={{ color: '#00FF99' }}>
                  Explore markets
                </Link>
              </p>
            </div>

            <div>
              <div
                style={{
                  width: '748px',
                  height: '0px',
                  borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                  marginTop: '40px',
                  marginBottom: '40px',
                }}
              />
              <h2 className="text-2xl font-normal text-white mb-6">
                Make Your First Trade
              </h2>
              <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
                <li>Select a market you&apos;re interested in</li>
                <li>Review the market details, resolution date, and current prices</li>
                <li>Choose your position: YES or NO</li>
                <li>Enter the amount of HBAR you want to trade</li>
                <li>Review the estimated shares you&apos;ll receive</li>
                <li>Click &quot;Buy Shares&quot; and confirm the transaction in your wallet</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-64 border-l border-gray-800 bg-black">
          <div className="sidebar-block">
            <h4 className="font-roboto font-normal text-gray-400 mb-4 uppercase tracking-wider text-base">
              On this page
            </h4>
            <nav className="space-y-2">
              <a href="#connect-wallet" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                Connect Your Wallet
              </a>
              <a href="#explore-markets" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                Explore Markets
              </a>
              <a href="#first-trade" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                Make Your First Trade
              </a>
            </nav>
          </div>
        </aside>
      </main>

      {/* Prev/Next navigation */}
      <div style={{ maxWidth: '730px', paddingLeft: '48px', paddingRight: '48px', marginLeft: '277px', marginTop: '60px' }}>
        <div
          style={{
            width: '748px',
            height: '0px',
            borderTop: '1px solid rgba(179, 179, 179, 0.5)',
            marginBottom: '40px',
          }}
        />
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <Link href="/docs/installation" className="text-white px-0 py-2 font-roboto">Back</Link>
            <Link href="/docs/installation" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Installation</Link>
          </div>
          <div className="flex flex-col items-end">
            <Link href="/docs/guides" className="text-white px-0 py-2 font-roboto">Next</Link>
            <Link href="/docs/guides" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Guides</Link>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  );
};

export default GettingStarted;
