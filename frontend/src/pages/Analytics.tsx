import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Analytics: NextPage = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  const platformStats = {
    totalVolume: '45,890 HBAR',
    totalMarkets: 127,
    activeUsers: 1543,
    totalTrades: 8921,
  };

  const topMarkets = [
    {
      id: 't1',
      title: 'Will Bitcoin reach $100,000 by end of 2025?',
      category: 'Crypto',
      volume: '2,450 HBAR',
      trades: 234,
    },
    {
      id: 't2',
      title: 'Will Team A win the championship this season?',
      category: 'Sports',
      volume: '1,120 HBAR',
      trades: 156,
    },
    {
      id: 't3',
      title: 'Will there be a recession in Q1 2025?',
      category: 'Politics',
      volume: '980 HBAR',
      trades: 98,
    },
  ];

  const categoryDistribution = [
    { category: 'Crypto', percentage: 35, volume: '16,062 HBAR' },
    { category: 'Sports', percentage: 28, volume: '12,849 HBAR' },
    { category: 'Politics', percentage: 18, volume: '8,260 HBAR' },
    { category: 'Entertainment', percentage: 12, volume: '5,507 HBAR' },
    { category: 'Weather', percentage: 5, volume: '2,295 HBAR' },
    { category: 'Other', percentage: 2, volume: '918 HBAR' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Analytics</title>
        <meta name="description" content="Platform analytics and insights" />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: '1312px',
            minWidth: '1200px',
            padding: '40px 64px',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-orbitron font-semibold text-[32px] text-white mb-2">
              Platform Analytics
            </h1>
            <p className="font-orbitron text-[16px] text-[#CCCCCC]">
              Real-time insights into market activity and trends
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-4 mb-8">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className="font-orbitron transition-colors duration-200"
                style={{
                  fontSize: '14px',
                  padding: '8px 16px',
                  border: '2px solid #2F2F2F',
                  borderRadius: '6px',
                  background: timeframe === tf ? '#00FF99' : 'transparent',
                  color: timeframe === tf ? '#000000' : '#FFFFFF',
                  boxShadow: timeframe === tf ? '0 0 14px #00FF99' : 'none',
                }}
              >
                {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Total Volume</div>
              <div className="font-orbitron text-[24px] font-bold text-white">
                {platformStats.totalVolume}
              </div>
            </div>
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Total Markets</div>
              <div className="font-orbitron text-[24px] font-bold text-white">
                {platformStats.totalMarkets}
              </div>
            </div>
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Active Users</div>
              <div className="font-orbitron text-[24px] font-bold text-white">
                {platformStats.activeUsers}
              </div>
            </div>
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Total Trades</div>
              <div className="font-orbitron text-[24px] font-bold text-white">
                {platformStats.totalTrades}
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8">
            {/* Top Markets */}
            <div>
              <h2 className="font-orbitron font-semibold text-[24px] text-white mb-6">
                Top Markets
              </h2>
              <div className="flex flex-col gap-4">
                {topMarkets.map((market, idx) => (
                  <div
                    key={market.id}
                    className="rounded-lg p-4"
                    style={{
                      background: '#1a1a1a',
                      border: '2px solid #00FF73',
                      boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="font-orbitron font-bold text-[20px] flex-shrink-0"
                        style={{
                          color: '#00FF99',
                          width: '30px',
                        }}
                      >
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-orbitron text-[14px] text-[#00FF99] mb-1">
                          {market.category}
                        </div>
                        <div className="font-orbitron text-[16px] font-semibold text-white mb-3">
                          {market.title}
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <div className="font-orbitron text-[12px] text-[#CCCCCC]">Volume</div>
                            <div className="font-orbitron text-[14px] text-white">
                              {market.volume}
                            </div>
                          </div>
                          <div>
                            <div className="font-orbitron text-[12px] text-[#CCCCCC]">Trades</div>
                            <div className="font-orbitron text-[14px] text-white">
                              {market.trades}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div>
              <h2 className="font-orbitron font-semibold text-[24px] text-white mb-6">
                Category Distribution
              </h2>
              <div className="flex flex-col gap-4">
                {categoryDistribution.map((cat) => (
                  <div
                    key={cat.category}
                    className="rounded-lg p-4"
                    style={{
                      background: '#1a1a1a',
                      border: '2px solid #2F2F2F',
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-orbitron text-[16px] font-semibold text-white">
                        {cat.category}
                      </div>
                      <div className="font-orbitron text-[18px] font-bold text-[#00FF99]">
                        {cat.percentage}%
                      </div>
                    </div>
                    <div className="w-full bg-[#0d0d0d] rounded-full h-3 mb-2">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${cat.percentage}%`,
                          background: '#00FF99',
                          boxShadow: '0 0 10px #00FF99',
                        }}
                      />
                    </div>
                    <div className="font-orbitron text-[12px] text-[#CCCCCC]">{cat.volume}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;

