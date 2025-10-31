import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Guides: NextPage = () => {
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
        <title>Guides - Documentation</title>
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
                    section.id === 'guides'
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
            Guides
          </h1>

          <div className="space-y-16">
            {/* User Guide Section */}
            <div id="user-guide">
              <h2 className="text-3xl font-normal text-white mb-8">
                For Users
              </h2>

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
                  <h2 id="trading-on-markets" className="text-2xl font-normal text-white mb-6">
                    Trading on Markets
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-normal text-white mb-4">
                      Buying Shares
                    </h3>
                    <p className="mb-4 text-gray-300">
                      When you buy YES or NO shares, you&apos;re taking a position on the outcome of an event. YES shares represent your belief that the event will occur, and you profit if the outcome is YES. Conversely, NO shares represent your belief that the event will not occur, and you profit if the outcome is NO. This binary structure makes it simple to express your prediction and understand your potential returns.
                    </p>
                    <p className="mb-6 text-gray-300">
                      Share prices range from 0 to 1 HBAR, effectively representing the market&apos;s probability estimate from 0-100%. Each trade incurs a modest 0.5% fee, split between a 0.1% platform fee and 0.4% that goes directly to liquidity providers as a reward for supplying capital. It&apos;s important to note that larger trades will have higher price impact due to the automated market maker (AMM) model, which adjusts prices based on the ratio of YES and NO share reserves. Planning your position size accordingly can help you minimize slippage and get better execution prices.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-normal text-white mb-4">
                      Selling Shares
                    </h3>
                    <p className="mb-6 text-gray-300">
                      You can sell your shares at any time before the market resolves.
                    </p>
                    <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
                      <li>Go to your portfolio and select the market</li>
                      <li>Click &quot;Sell Shares&quot;</li>
                      <li>Enter the number of shares to sell</li>
                      <li>Review the estimated HBAR you&apos;ll receive (after 0.5% fee)</li>
                      <li>Confirm the transaction</li>
                    </ol>
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
                    Providing Liquidity
                  </h2>
                  <p className="mb-6 text-gray-300">
                    Liquidity providers (LPs) earn fees from every trade. When you add liquidity, you receive ERC20 LP tokens.
                  </p>

                  <div className="mb-8">
                    <h3 className="text-xl font-normal text-white mb-4">
                      LP Token Benefits
                    </h3>
                    <p className="mb-4 text-gray-300">
                      LP tokens provide liquidity providers with automatic fee earnings of 0.4% from every trade executed on the market, which represents 80% of the total trading fees. This creates a passive income stream that grows proportionally with trading volume. The more active a market becomes, the more fees accumulate for LP token holders, making high-volume markets particularly attractive for liquidity provision.
                    </p>
                    <p className="mb-6 text-gray-300">
                      These LP tokens are fully transferable ERC20 tokens, meaning they can be sent to other wallets, traded on secondary markets, or used as collateral in other DeFi protocols. Each LP token represents proportional ownership of the pool&apos;s total value, including all accumulated fees from trading activity. This composability and transferability sets Truce apart from platforms with locked or non-transferable liquidity positions, giving LPs maximum flexibility to manage their capital.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-normal text-white mb-4">
                      Removing Liquidity
                    </h3>
                    <p className="text-gray-300">
                      During Active State: Remove liquidity by burning LP tokens to receive proportional HBAR.<br />
                      After Resolution: Redeem LP tokens for your share of the pool (including accumulated fees).
                    </p>
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
                    Creating Markets
                  </h2>
                  <p className="mb-6 text-gray-300">
                    Anyone can create a new prediction market. As the creator, you provide initial liquidity and are responsible for resolving the market.
                  </p>

                  <div className="mb-8">
                    <h3 className="text-xl font-normal text-white mb-4">
                      How to Create a Market
                    </h3>
                    <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
                      <li>Click &quot;Create Market&quot; in the navigation</li>
                      <li>Enter a clear, unambiguous question</li>
                      <li>Select a category</li>
                      <li>Set the resolution deadline (between 1 hour and 365 days from now)</li>
                      <li>Provide initial liquidity (minimum 0.000000000001 HBAR)</li>
                      <li>Review and confirm the transaction</li>
                    </ol>
                  </div>

                  <p className="text-sm text-gray-400 italic mb-6">
                    As the market creator, you are responsible for resolving the market correctly after the deadline. 
                    Incorrect resolutions can be disputed, which will damage your reputation score.
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
                    Market Resolution & Disputes
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-normal text-white mb-4">
                      Resolution Process
                    </h3>
                    <p className="mb-4 text-gray-300">
                      The resolution process begins when a market enters its Active state, during which it remains open for trading until the predetermined resolution deadline. Once the deadline passes, the market creator assumes responsibility for resolving the market by declaring the correct outcome based on real-world events. This creator-driven resolution model empowers the community while maintaining accountability through the dispute mechanism.
                    </p>
                    <p className="mb-4 text-gray-300">
                      After the creator resolves the market, a critical 24-hour dispute period begins, allowing any participant to challenge the resolution by posting a 0.05 HBAR bond if they believe the outcome was recorded incorrectly. This dispute window serves as a community check against dishonest or mistaken resolutions. Once the dispute period concludes without valid challenges, anyone can trigger the finalization transaction, which locks in the outcome permanently.
                    </p>
                    <p className="mb-6 text-gray-300">
                      Following finalization, users can redeem their winning shares or LP tokens for their proportional share of the pool. Winning share holders receive the full value of their shares (1 HBAR per share), while losing shares become worthless. Liquidity providers receive their proportional share of the remaining pool value, including all accumulated trading fees, regardless of the market outcome. This seamless redemption process ensures all participants can claim their earnings with a single transaction.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-normal text-white mb-4">
                      How to Dispute
                    </h3>
                    <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
                      <li>Navigate to the market within 24 hours of resolution</li>
                      <li>Click &quot;Submit Dispute&quot;</li>
                      <li>Select the correct outcome and provide evidence/reasoning</li>
                      <li>Send 0.05 HBAR as a dispute bond</li>
                      <li>Wait for platform review</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Guide Section */}
            
            <div id="developer-guide" className="pt-20">
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
                  <h2 id="smart-contract-architecture" className="text-2xl font-normal text-white mb-6">
                    Smart Contract Architecture
                  </h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-normal text-white mb-4">
                        TruceFactory
                      </h3>
                      <p className="mb-6 text-gray-300">
                        Factory contract for deploying and managing markets. This is the main entry point for creating new prediction markets and serves as the central registry for all deployed markets on the platform.
                      </p>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">createMarket()</h4>
                          <p className="text-gray-300 mb-3">Deploys a new prediction market contract and registers it in the factory.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">question</span> (string) - The prediction market question that users will trade on</li>
                              <li>• <span className="text-white font-mono">deadline</span> (uint256) - Unix timestamp when the market closes for trading and becomes eligible for resolution</li>
                              <li>• <span className="text-white font-mono">liquidity</span> (uint256) - Initial HBAR amount provided as liquidity, sent as msg.value with the transaction</li>
                              <li>• <span className="text-white font-mono">category</span> (string) - Market category for filtering (e.g., &quot;crypto&quot;, &quot;politics&quot;, &quot;sports&quot;, &quot;weather&quot;)</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">address</span> - The address of the newly deployed TruceMarket contract</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">getAllMarkets()</h4>
                          <p className="text-gray-300 mb-3">Retrieves all deployed market contracts from the factory registry.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <p className="text-sm text-gray-300 ml-4">• None</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">address[]</span> - Array containing addresses of all deployed market contracts</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">resolveMarketDispute()</h4>
                          <p className="text-gray-300 mb-3">Resolves a disputed market outcome. Only callable by platform administrators.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">market</span> (address) - The address of the disputed market contract</li>
                              <li>• <span className="text-white font-mono">isValid</span> (bool) - True if the dispute is valid (creator was wrong), false if creator was correct</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Access Control:</p>
                            <p className="text-sm text-gray-300 ml-4">• Only callable by platform admin after dispute period</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-normal text-white mb-4">
                        TruceMarket (ERC20)
                      </h3>
                      <p className="mb-6 text-gray-300">
                        Individual prediction market contract. Inherits ERC20 for LP tokens, enabling full composability with other DeFi protocols. Each market is deployed as a separate contract instance with its own liquidity pool and state management.
                      </p>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">buyShares()</h4>
                          <p className="text-gray-300 mb-3">Purchases outcome shares (YES or NO) from the AMM pool using the constant product formula.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">outcome</span> (Outcome enum) - The outcome to buy shares for, either Outcome.Yes or Outcome.No</li>
                              <li>• <span className="text-white font-mono">msg.value</span> (HBAR) - Amount of HBAR sent with transaction to spend on shares (payable function)</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">uint256</span> - Number of outcome shares received based on current pool reserves</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Notes:</p>
                            <p className="text-sm text-gray-300 ml-4">• Applies 0.5% fee (0.1% platform, 0.4% to LPs) on the transaction amount</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">sellShares()</h4>
                          <p className="text-gray-300 mb-3">Sells outcome shares back to the AMM pool in exchange for HBAR.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">outcome</span> (Outcome enum) - Type of shares being sold (Outcome.Yes or Outcome.No)</li>
                              <li>• <span className="text-white font-mono">shares</span> (uint256) - Number of shares to sell back to the pool</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">uint256</span> - Amount of HBAR received after deducting 0.5% fees</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Requirements:</p>
                            <p className="text-sm text-gray-300 ml-4">• Caller must own sufficient shares of the specified outcome type</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">addLiquidity()</h4>
                          <p className="text-gray-300 mb-3">Adds liquidity to the market pool and mints proportional ERC20 LP tokens.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">msg.value</span> (HBAR) - Amount of HBAR to add as liquidity (payable function)</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">uint256</span> - Amount of LP tokens minted, proportional to share of total pool</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Behavior:</p>
                            <p className="text-sm text-gray-300 ml-4">• Liquidity is split equally between YES and NO reserves to maintain balance</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">redeemWinnings()</h4>
                          <p className="text-gray-300 mb-3">Redeems winning shares or LP tokens for HBAR after market finalization.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <p className="text-sm text-gray-300 ml-4">• None</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">uint256</span> - Total amount of HBAR redeemed from winning shares and/or LP tokens</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Redemption Rules:</p>
                            <ul className="space-y-1 text-sm text-gray-300 ml-4">
                              <li>• Winning outcome shares redeem at 1:1 ratio (1 share = 1 HBAR)</li>
                              <li>• Losing outcome shares have zero value</li>
                              <li>• LP tokens redeem for proportional share of remaining pool value plus accumulated fees</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-normal text-white mb-4">
                        TruceAMM (Library)
                      </h3>
                      <p className="mb-6 text-gray-300">
                        Pure math library for AMM calculations using the constant product formula (x × y = k). Contains view-only functions with no state modifications, making it gas-efficient and auditable. Used by TruceMarket contracts for all pricing and liquidity calculations.
                      </p>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">calculateSharesOut()</h4>
                          <p className="text-gray-300 mb-3">Calculates the number of outcome shares a buyer will receive for a given HBAR amount.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">reserves</span> (Reserves struct) - Current pool reserves containing YES and NO share amounts</li>
                              <li>• <span className="text-white font-mono">amount</span> (uint256) - Amount of HBAR being spent to purchase shares</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">uint256</span> - Number of outcome shares to receive after applying constant product formula and fees</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Formula:</p>
                            <p className="text-sm text-gray-300 ml-4">• Uses x × y = k to maintain pool balance, where trading fees are deducted before calculation</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">calculateHbarOut()</h4>
                          <p className="text-gray-300 mb-3">Calculates the amount of HBAR a seller will receive for selling a specific number of shares.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">reserves</span> (Reserves struct) - Current pool reserves containing YES and NO share amounts</li>
                              <li>• <span className="text-white font-mono">shares</span> (uint256) - Number of outcome shares being sold back to the pool</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">uint256</span> - Amount of HBAR to receive after deducting 0.5% trading fees</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Behavior:</p>
                            <p className="text-sm text-gray-300 ml-4">• Inverse of calculateSharesOut(), returns shares to pool and calculates proportional HBAR output</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 font-mono">getPrice()</h4>
                          <p className="text-gray-300 mb-3">Calculates current market prices for YES and NO outcomes as probability percentages.</p>
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-400 mb-2">Parameters:</p>
                            <ul className="space-y-2 text-sm text-gray-300 ml-4">
                              <li>• <span className="text-white font-mono">yesReserves</span> (uint256) - Current amount of YES shares in the pool</li>
                              <li>• <span className="text-white font-mono">noReserves</span> (uint256) - Current amount of NO shares in the pool</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Returns:</p>
                            <p className="text-sm text-gray-300 ml-4">• <span className="text-white font-mono">(uint256, uint256)</span> - Tuple containing (YES price, NO price) where both values sum to exactly 1 HBAR</p>
                            <p className="text-sm font-semibold text-gray-400 mt-4 mb-2">Price Formula:</p>
                            <ul className="space-y-1 text-sm text-gray-300 ml-4">
                              <li>• YES price = NO_reserves / (YES_reserves + NO_reserves)</li>
                              <li>• NO price = YES_reserves / (YES_reserves + NO_reserves)</li>
                              <li>• Prices represent probability (0-100%) where 0.7 HBAR = 70% probability</li>
                            </ul>
                          </div>
                        </div>
                      </div>
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
                    Key Technical Details
                  </h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-normal text-white mb-3">
                        Fee Structure
                      </h3>
                      <p className="mb-4 text-gray-300">
                        Truce implements a competitive fee structure with a total of 0.5% per trade, equivalent to 50 basis points. This fee is deliberately kept low to encourage active trading and market participation. The fee split is designed to balance platform sustainability with rewarding liquidity providers who make markets possible.
                      </p>
                      <p className="mb-6 text-gray-300">
                        The fee breakdown allocates 0.1% to the TruceFactory platform for ongoing development, security audits, and infrastructure maintenance. The remaining 0.4%—representing 80% of total fees—is accumulated directly in the market and distributed proportionally to liquidity providers through their LP tokens. This alignment ensures that those who provide capital are properly incentivized and receive the majority of trading fees.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-normal text-white mb-3">
                        Dynamic Market Caps
                      </h3>
                    <p className="mb-4 text-gray-300">
                      Truce features an innovative dynamic market cap system that allows markets to grow organically based on actual demand. The initial market cap is set equal to the initial liquidity provided by the market creator, establishing a baseline for market size. This ensures that markets start at an appropriate scale relative to the creator&apos;s commitment and confidence in the question.
                    </p>
                    <p className="mb-6 text-gray-300">
                      When market utilization reaches 80%—indicating strong demand and healthy trading activity—the cap automatically doubles, allowing the market to accommodate more liquidity and larger positions. To prevent manipulation and front-running of cap increases, there&apos;s a minimum 1-hour cooldown period between consecutive cap expansions. This measured approach enables markets to scale naturally while maintaining stability and preventing artificial pump schemes.
                    </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-normal text-white mb-3">
                        AMM Formula
                      </h3>
                    <p className="mb-4 text-gray-300">
                      Truce&apos;s automated market maker uses the battle-tested constant product formula (x × y = k), where x represents YES share reserves and y represents NO share reserves, with k remaining constant. This elegant mathematical model has been proven reliable across billions of dollars in decentralized exchange volume and ensures that liquidity is always available at some price, eliminating the need for order books or manual market making.
                    </p>
                    <p className="mb-6 text-gray-300">
                      The YES share price is calculated as NO_reserves divided by the sum of YES_reserves and NO_reserves, creating a natural probability representation. A key property of this system is that YES and NO prices always sum to exactly 1 (representing 100% probability), maintaining mathematical consistency and preventing arbitrage opportunities. As traders buy one outcome, its price increases and the opposite outcome&apos;s price decreases proportionally, creating efficient price discovery through market forces.
                    </p>
                    </div>
                  </div>
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
            <nav>
              <div>
                <a href="#user-guide" className=" font-roboto text-xs text-gray-500 mb-2 uppercase tracking-wider block hover:text-white transition-colors">For Users</a>
                <a href="#trading-on-markets" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Trading on Markets
                </a>
                <a href="#user-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Buying Shares
                </a>
                <a href="#user-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Selling Shares
                </a>
                <a href="#user-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Providing Liquidity
                </a>
                <a href="#user-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Creating Markets
                </a>
                <a href="#user-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Market Resolution
                </a>
              </div>
              <div style={{ marginTop: '32px' }}>
                <a href="#developer-guide" className=" font-roboto text-xs text-gray-500 mb-2 uppercase tracking-wider block hover:text-white transition-colors">For Developers</a>
                <a href="#smart-contract-architecture" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Smart Contract Architecture
                </a>
                <a href="#developer-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Integration Examples
                </a>
                <a href="#developer-guide" className="block font-roboto text-gray-300 hover:text-white transition-colors text-base">
                  Technical Details
                </a>
              </div>
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
            <Link href="/docs/getting-started" className="text-white px-0 py-2 font-roboto">Back</Link>
            <Link href="/docs/getting-started" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">Getting Started</Link>
          </div>
          <div className="flex flex-col items-end">
            <Link href="/docs/faq" className="text-white px-0 py-2 font-roboto">Next</Link>
            <Link href="/docs/faq" className="text-gray-400 text-sm mt-1 hover:text-white font-roboto">FAQ</Link>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  );
};

export default Guides;

