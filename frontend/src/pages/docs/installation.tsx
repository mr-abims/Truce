import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Installation: NextPage = () => {
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
        <title>Installation - Documentation</title>
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
                    section.id === 'installation'
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
            Installation & Setup
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
                Wallet Setup
              </h2>
              <p className="mb-8 text-gray-300">
                To use Truce, you need a Web3 wallet. We recommend HashPack:
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-gray-900 rounded-lg">
                  <h3 className="text-lg font-normal text-white mb-3">
                    Hashpack (Recommended)
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    The most popular Hedera wallet with browser extension support.
                  </p>
                  <a
                    href="https://www.hashpack.app/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-normal rounded transition-colors"
                  >
                    Download Hashpack.
                  </a>
                </div>
              </div>
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
                Get TEST TOKENS
              </h2>
              <p className="mb-8 text-gray-300">
                For testing on Hedera testnet, you&apos;ll need test HBAR:
              </p>
              <ul className="space-y-3 list-disc list-inside text-sm text-gray-300 ml-4">
                <li>
                  <a href="https://portal.hedera.com//" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    HederaFaucet.com
                  </a> - Get 0.5 HBAR every 24 hours
                </li>
              </ul>
              <p className="text-sm text-gray-400 mt-4 italic">
                Make sure you create to the account on the Hedera testnetwork website and claim test tokens from the faucets.
              </p>
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
              <a href="#wallet-setup" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                Wallet Setup
              </a>
              <a href="#get-test-tokens" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                Get Test Tokens
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
            <Link href="/docs/why-truce" className="text-white px-0 py-2 font-roboto">Back</Link>
            <Link href="/docs/why-truce" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Why Truce</Link>
          </div>
          <div className="flex flex-col items-end">
            <Link href="/docs/getting-started" className="text-white px-0 py-2 font-roboto">Next</Link>
            <Link href="/docs/getting-started" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Getting Started</Link>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  );
};

export default Installation;
