import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Docs: NextPage = () => {
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
        <title>Truce</title>
        <meta name="description" content="Complete guide to using Truce prediction markets" />
      </Head>

      <Navbar />

      <main className="flex-1 flex">
        {/* Left Sidebar */}
        <aside className="h-screen sticky top-0 overflow-y-auto bg-black" style={{ width: '277px' }}>
          <div className="sidebar-block">
            <h3 className="font-roboto font-normal text-gray-400 mb-8 uppercase tracking-wider text-base">
              Docs
            </h3>
            <nav className="w-full">
              {mainSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className="block py-2 font-roboto text-gray-300 hover:text-white transition-colors text-base"
                >
                  {section.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 px-12 py-12 bg-gray-900 font-roboto" style={{ maxWidth: '730px' }}>
          <h1 className="text-5xl font-normal text-white mb-4">
            Truce
          </h1>

          <p className="mb-12 text-gray-400">
            Welcome to Truce Documentation.
          </p>

          <div
            style={{
              width: '748px',
              height: '0px',
              borderTop: '1px solid rgba(179, 179, 179, 0.5)',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          />

          <h2 className="text-3xl font-normal text-white mb-6 mt-20">
            What is Truce
          </h2>
          <p className="mb-16 text-gray-300">
            Truce is a decentralized prediction market protocol that allows users to create binary outcome markets (YES/NO questions about future events), trade shares by buying and selling positions using an automated market maker (AMM), provide liquidity to earn fees through ERC20 LP tokens, and resolve markets through community-driven resolution with dispute mechanisms.
          </p>

          <div
            style={{
              width: '748px',
              height: '0px',
              borderTop: '1px solid rgba(179, 179, 179, 0.5)',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          />

          <h2 className="text-3xl font-normal text-white mb-6 mt-20">
            Quick Start
          </h2>
          <p className="mb-6 text-gray-300">
            Get started with Truce in minutes:
          </p>
              <ol className="list-decimal list-inside mb-16 space-y-3 ml-4 text-gray-300">
                <li>Install a Web3 wallet like HashPack</li>
                <li>Get test HBAR from Hedera Testnet faucet</li>
                <li>Connect your wallet to the platform</li>
                <li>Start exploring and trading on prediction markets</li>
              </ol>

          <div
            style={{
              width: '748px',
              height: '0px',
              borderTop: '1px solid rgba(179, 179, 179, 0.5)',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          />
          <div className="pt-12">
            <h2 className="text-3xl font-normal text-white mb-6">
              Next Steps
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <Link
                href="/docs/why-truce"
                className="block p-6 bg-gray-900 hover:bg-gray-800 transition-colors rounded-lg"
              >
                <h3 className="text-xl font-normal text-white mb-2">
                  Why Choose Truce?
                </h3>
                  <p className="text-gray-400">
                    Learn about Truce&apos;s key features including low fees, dispute resolution, and ERC20 LP tokens.
                  </p>
              </Link>
              <Link
                href="/docs/installation"
                className="block p-6 bg-gray-900 hover:bg-gray-800 transition-colors rounded-lg"
              >
                <h3 className="text-xl font-normal text-white mb-2">
                  Installation & Setup
                </h3>
                <p className="text-gray-400">
                  Set up your wallet and get test tokens to start using Truce on testnet.
                </p>
              </Link>
              <Link
                href="/docs/getting-started"
                className="block p-6 bg-gray-900 hover:bg-gray-800 transition-colors rounded-lg"
              >
                <h3 className="text-xl font-normal text-white mb-2">
                  Getting Started
                </h3>
                <p className="text-gray-400">
                  Connect your wallet, explore markets, and make your first trade.
                </p>
              </Link>
              <Link
                href="/docs/guides"
                className="block p-6 bg-gray-900 hover:bg-gray-800 transition-colors rounded-lg"
              >
                <h3 className="text-xl font-normal text-white mb-2">
                  Guides
                </h3>
                <p className="text-gray-400">
                  Comprehensive guides for users and developers to master Truce.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Empty for index */}
        <aside className="w-64 border-l border-gray-800 bg-black"></aside>
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
            <span className="text-white opacity-40 cursor-not-allowed select-none px-0 py-2 font-roboto">Back</span>
            <span className="text-gray-400 text-sm mt-1 font-roboto">—</span>
          </div>
          <div className="flex flex-col items-end">
            <Link href="/docs/why-truce" className="text-white px-0 py-2 font-roboto">Next</Link>
            <Link href="/docs/why-truce" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Why Truce</Link>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  );
};

export default Docs;
