import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const FAQ: NextPage = () => {
  const mainSections = [
    { id: 'introduction', title: 'Introduction', href: '/docs' },
    { id: 'why-truce', title: 'Why Truce', href: '/docs/why-truce' },
    { id: 'installation', title: 'Installation', href: '/docs/installation' },
    { id: 'getting-started', title: 'Getting Started', href: '/docs/getting-started' },
    { id: 'guides', title: 'Guides', href: '/docs/guides' },
    { id: 'faq', title: 'FAQ', href: '/docs/faq' },
  ];

  const faqs = [
    {
      q: 'What is a prediction market?',
      a: 'A prediction market is a place where people can trade on the outcome of future events. Share prices represent the market\'s collective belief about the probability of an outcome. If you correctly predict an event, you profit from your shares.',
    },
    {
      q: 'How do I make money on Truce?',
      a: 'There are two main ways: (1) Trading: Buy shares at a low price and either sell them higher or hold until the market resolves in your favor. (2) Providing Liquidity: Add liquidity to earn 0.4% of all trading fees automatically.',
    },
    {
      q: 'What are LP tokens?',
      a: 'LP (Liquidity Provider) tokens are ERC20 tokens that represent your share of a market\'s liquidity pool. They automatically accumulate fees from every trade. You can transfer them, trade them, or redeem them for your proportional share of the pool.',
    },
    {
      q: 'How does pricing work?',
      a: 'Truce uses an automated market maker (AMM) with the constant product formula (x × y = k). Share prices represent probability - a YES share costing 0.7 HBAR means the market believes there\'s a 70% chance the event will happen. Prices automatically adjust based on supply and demand.',
    },
    {
      q: 'What fees does Truce charge?',
      a: 'Truce charges only 0.5% per trade (0.1% platform fee, 0.4% to liquidity providers). This is 4x lower than competitors like Polymarket (2%). There are no fees for adding/removing liquidity, creating markets, or redeeming winnings.',
    },
    {
      q: 'How are markets resolved?',
      a: 'The market creator resolves the market after the deadline. Then there\'s a 24-hour dispute period where anyone can challenge the resolution by posting a 0.05 HBAR bond. If no disputes are submitted (or after disputes are resolved), the market is finalized and winners can redeem.',
    },
    {
      q: 'What happens if I hold losing shares?',
      a: 'Losing shares have no value after the market is resolved. If you bought NO shares and the outcome is YES, your NO shares become worthless. Only winning shares can be redeemed for HBAR.',
    },
    {
      q: 'Can I sell my shares before the market resolves?',
      a: 'Yes! You can buy and sell shares at any time while the market is active. This lets you take profits early, cut losses, or adjust your position based on new information.',
    },
    {
      q: 'What is price impact and slippage?',
      a: 'Due to the AMM model, larger trades move the price more. Price impact is the difference between the current price and the execution price. For large trades, consider splitting them into multiple smaller trades or waiting for more liquidity.',
    },
    {
      q: 'How does the dynamic cap system work?',
      a: 'Markets start with a cap equal to initial liquidity. When total reserves reach 80% of the cap, it automatically doubles (limited to once per hour). This allows markets to grow organically while preventing manipulation from instant large trades.',
    },
    {
      q: 'Is Truce audited?',
      a: 'Truce smart contracts implement industry-standard security practices including OpenZeppelin\'s ReentrancyGuard, Checks-Effects-Interactions pattern, and safe math. Full audit reports will be published before mainnet launch.',
    },
    {
      q: 'Can I cancel or modify a market after creating it?',
      a: 'No, markets are immutable once created. The question, deadline, and category cannot be changed. This ensures transparency and prevents manipulation. Make sure all details are correct before creating.',
    },
    {
      q: 'What networks does Truce support?',
      a: 'Truce is currently deployed on Sepolia testnet for testing. Mainnet deployment will support Ethereum and other EVM-compatible chains. Check our announcements for the latest network support.',
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>FAQ - Documentation</title>
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
                    section.id === 'faq'
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
            Frequently Asked Questions
          </h1>

          <div className="space-y-12">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-xl font-normal text-white mb-4">
                  {faq.q}
                </h3>
                <p className="text-gray-300">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        
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
            <Link href="/docs/guides" className="text-white px-0 py-2 font-roboto">Back</Link>
            <Link href="/docs/guides" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Guides</Link>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white opacity-40 cursor-not-allowed select-none px-0 py-2 font-roboto">Next</span>
            <span className="text-gray-400 text-sm mt-1 font-roboto">—</span>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  );
};

export default FAQ;

