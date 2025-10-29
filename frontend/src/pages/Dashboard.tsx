import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const mockActivePositions = [
    {
      id: 'p1',
      market: 'Will Bitcoin reach $100,000 by end of 2025?',
      position: 'YES',
      shares: 50,
      avgPrice: '0.68 HBAR',
      currentPrice: '0.72 HBAR',
      value: '36 HBAR',
      pnl: '+5.88%',
    },
    {
      id: 'p2',
      market: 'Will Team A win the championship this season?',
      position: 'NO',
      shares: 30,
      avgPrice: '0.45 HBAR',
      currentPrice: '0.42 HBAR',
      value: '12.6 HBAR',
      pnl: '-6.67%',
    },
  ];

  const mockHistory = [
    {
      id: 'h1',
      market: 'Will there be snow in December?',
      position: 'YES',
      outcome: 'WON',
      invested: '20 HBAR',
      returned: '38 HBAR',
      profit: '+18 HBAR',
      date: 'Jan 05, 2025',
    },
    {
      id: 'h2',
      market: 'Will ETH reach $5000 in Q4?',
      position: 'NO',
      outcome: 'LOST',
      invested: '15 HBAR',
      returned: '0 HBAR',
      profit: '-15 HBAR',
      date: 'Dec 31, 2024',
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Dashboard</title>
        <meta name="description" content="View your positions and trading history" />
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
             Dashboard
            </h1>
            <p className="font-orbitron text-[16px] text-[#CCCCCC]">
              Track your positions and performance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Total Volume</div>
              <div className="font-orbitron text-[28px] font-bold text-white">128.5 HBAR</div>
            </div>
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Active Markets</div>
              <div className="font-orbitron text-[28px] font-bold text-white">2</div>
            </div>
            <div
              className="rounded-lg p-6"
              style={{
                background: '#1a1a1a',
                border: '2px solid #00FF73',
                boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
              }}
            >
              <div className="font-orbitron text-[14px] text-[#CCCCCC] mb-2">Total P&L</div>
              <div className="font-orbitron text-[28px] font-bold text-[#00FF99]">+3 HBAR</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className="font-orbitron transition-colors duration-200"
              style={{
                fontSize: '16px',
                padding: '10px 20px',
                border: '2px solid #2F2F2F',
                borderRadius: '6px',
                background: activeTab === 'active' ? '#00FF99' : 'transparent',
                color: activeTab === 'active' ? '#000000' : '#FFFFFF',
                boxShadow: activeTab === 'active' ? '0 0 14px #00FF99' : 'none',
              }}
            >
              Active Positions
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="font-orbitron transition-colors duration-200"
              style={{
                fontSize: '16px',
                padding: '10px 20px',
                border: '2px solid #2F2F2F',
                borderRadius: '6px',
                background: activeTab === 'history' ? '#00FF99' : 'transparent',
                color: activeTab === 'history' ? '#000000' : '#FFFFFF',
                boxShadow: activeTab === 'history' ? '0 0 14px #00FF99' : 'none',
              }}
            >
              History
            </button>
          </div>

          {/* Active Positions */}
          {activeTab === 'active' && (
            <div className="flex flex-col gap-4">
              {mockActivePositions.map((pos) => (
                <div
                  key={pos.id}
                  className="rounded-lg p-5"
                  style={{
                    background: '#1a1a1a',
                    border: '2px solid #00FF73',
                    boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="font-orbitron text-[18px] font-semibold text-white mb-2">
                        {pos.market}
                      </div>
                      <div
                        className="inline-block px-3 py-1 rounded font-orbitron text-[12px] font-bold"
                        style={{
                          background: pos.position === 'YES' ? '#00FF99' : '#FF3366',
                          color: '#000000',
                        }}
                      >
                        {pos.position}
                      </div>
                    </div>
                    <div
                      className="font-orbitron text-[20px] font-bold"
                      style={{
                        color: pos.pnl.startsWith('+') ? '#00FF99' : '#FF3366',
                      }}
                    >
                      {pos.pnl}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">Shares</div>
                      <div className="font-orbitron text-[14px] text-white">{pos.shares}</div>
                    </div>
                    <div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">Avg Price</div>
                      <div className="font-orbitron text-[14px] text-white">{pos.avgPrice}</div>
                    </div>
                    <div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">Current Price</div>
                      <div className="font-orbitron text-[14px] text-white">{pos.currentPrice}</div>
                    </div>
                    <div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">Value</div>
                      <div className="font-orbitron text-[14px] text-white">{pos.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-4">
              {mockHistory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg p-5"
                  style={{
                    background: '#1a1a1a',
                    border: '2px solid #2F2F2F',
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="font-orbitron text-[18px] font-semibold text-white mb-2">
                        {item.market}
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="inline-block px-3 py-1 rounded font-orbitron text-[12px] font-bold"
                          style={{
                            background: item.position === 'YES' ? '#00FF99' : '#FF3366',
                            color: '#000000',
                          }}
                        >
                          {item.position}
                        </div>
                        <div
                          className="inline-block px-3 py-1 rounded font-orbitron text-[12px] font-bold"
                          style={{
                            background: item.outcome === 'WON' ? '#00FF99' : '#FF3366',
                            color: '#000000',
                          }}
                        >
                          {item.outcome}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-orbitron text-[20px] font-bold"
                        style={{
                          color: item.profit.startsWith('+') ? '#00FF99' : '#FF3366',
                        }}
                      >
                        {item.profit}
                      </div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">{item.date}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">Invested</div>
                      <div className="font-orbitron text-[14px] text-white">{item.invested}</div>
                    </div>
                    <div>
                      <div className="font-orbitron text-[12px] text-[#CCCCCC]">Returned</div>
                      <div className="font-orbitron text-[14px] text-white">{item.returned}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

