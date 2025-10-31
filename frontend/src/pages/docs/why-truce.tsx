import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const WhyTruce: NextPage = () => {
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
        <title>Why Truce - Documentation</title>
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
                    section.id === 'why-truce'
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
            Why Truce Core?
          </h1>

          <div className="space-y-16">
            <div id="core">
              <div
                style={{
                  width: '748px',
                  height: '0px',
                  borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                  marginTop: '40px',
                  marginBottom: '40px',
                }}
              />
              <div className="space-y-8">
                <div id="core-problems">
                  <h2 className="text-xl font-normal mb-3" style={{ color: '#00FF99' }}>The Problems</h2>
                  <p className="text-gray-300 mb-4">Traditional prediction platforms suffer from high fees, rigid caps that throttle growth, poor liquidity at the tails, and opaque resolution processes that reduce trust. Most platforms extract 2%+ per trade while imposing arbitrary market size limits that prevent natural scaling.</p>
                  <p className="text-gray-300 mb-6">Builders face fragmented primitives that don&apos;t compose well with the rest of DeFi. LP positions are locked, non-transferable, and can&apos;t be used as collateral elsewhere. This siloed approach limits capital efficiency and prevents prediction markets from becoming core DeFi infrastructure.</p>
                  <div
                    style={{
                      width: '748px',
                      height: '0px',
                      borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                      marginTop: '40px',
                      marginBottom: '40px',
                    }}
                  />
                </div>
                <div id="core-ux">
                  <h2 className="text-xl font-normal mb-3" style={{ color: '#00FF99' }}>User Experience</h2>
                  <p className="text-gray-300 mb-4">Truce keeps actions intuitive: simple YES/NO markets, instant pricing via AMM, and a clean wallet-first flow. No complex order books or limit orders—just connect your wallet, pick an outcome, and trade. The interface shows real-time probabilities and expected returns before you commit.</p>
                  <p className="text-gray-300 mb-6">Users can enter and exit positions at any time before resolution, giving full flexibility to take profits or cut losses as new information emerges. Once markets finalize, redemption is instant with a single transaction. No waiting periods, no manual claims processing—just straightforward on-chain settlement.</p>
                  <div
                    style={{
                      width: '748px',
                      height: '0px',
                      borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                      marginTop: '40px',
                      marginBottom: '40px',
                    }}
                  />
                </div>
                <div id="core-performance">
                  <h2 className="text-xl font-normal mb-3" style={{ color: '#00FF99' }}>Performance</h2>
                  <p className="text-gray-300 mb-4">Low, predictable fees (0.5% total) and an AMM optimized for constant product ensure continuous liquidity and fair slippage. Unlike orderbook systems that can have wide spreads or thin liquidity, our AMM provides instant quotes for any trade size. 80% of fees flow directly to liquidity providers, incentivizing deep pools.</p>
                  <p className="text-gray-300 mb-6">Dynamic caps scale market depth automatically as demand grows. When utilization hits 80%, the cap doubles (max once per hour), allowing organic expansion without manual intervention. This prevents front-running of cap increases while ensuring markets never hit artificial ceilings during high-volume events.</p>
                  <div
                    style={{
                      width: '748px',
                      height: '0px',
                      borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                      marginTop: '40px',
                      marginBottom: '40px',
                    }}
                  />
                </div>
                <div id="core-coverage">
                  <h2 className="text-xl font-normal mb-3" style={{ color: '#00FF99' }}>Feature Coverage</h2>
                  <p className="text-gray-300 mb-4">From market creation to trading, LPing, dispute and finalization, Truce ships the full lifecycle. Anyone can create a market by providing initial liquidity, trade YES/NO shares using the AMM, or add liquidity to earn fees. Creators are responsible for resolution, with a 24-hour dispute window for community oversight.</p>
                  <p className="text-gray-300 mb-6">ERC20 LP tokens unlock composability: stake them in other protocols, transfer them to other wallets, or use them as collateral. Unlike non-transferable LP positions on other platforms, Truce LP tokens are first-class DeFi primitives that work seamlessly with the broader ecosystem. This opens up possibilities for LP token derivatives, lending markets, and cross-protocol strategies.</p>
                  <div
                    style={{
                      width: '748px',
                      height: '0px',
                      borderTop: '1px solid rgba(179, 179, 179, 0.5)',
                      marginTop: '40px',
                      marginBottom: '40px',
                    }}
                  />
                </div>
                <div id="core-stability">
                  <h2 className="text-xl font-normal mb-3" style={{ color: '#00FF99' }}>Stability</h2>
                  <p className="text-gray-300 mb-4">Battle-tested AMM math, guardrails around cap increases, and a transparent dispute window minimize edge-case failures and reinforce market integrity as volumes scale. The constant product formula (x × y = k) has been proven across billions in DEX volume. Our implementation follows OpenZeppelin security standards with reentrancy guards and safe math.</p>
                  <p className="text-gray-300 mb-6">The dispute mechanism creates accountability without centralization. Anyone can challenge an incorrect resolution by posting a 0.05 ETH bond within 24 hours. If the dispute is valid, the challenger recovers their bond and the creator&apos;s reputation takes a hit. This economic game theory ensures honest resolution while keeping the system permissionless and decentralized.</p>
                </div>
              </div>
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
              <a href="#core-problems" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">The Problems</a>
              <a href="#core-ux" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">User Experience</a>
              <a href="#core-performance" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">Performance</a>
              <a href="#core-coverage" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">Feature Coverage</a>
              <a href="#core-stability" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">Stability</a>
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
            <Link href="/docs" className="text-white px-0 py-2 font-roboto">Back</Link>
            <Link href="/docs" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Introduction</Link>
          </div>
          <div className="flex flex-col items-end">
            <Link href="/docs/installation" className="text-white px-0 py-2 font-roboto">Next</Link>
            <Link href="/docs/installation" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Installation</Link>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  );
};

export default WhyTruce;
