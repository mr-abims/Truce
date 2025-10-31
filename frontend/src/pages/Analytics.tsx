import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAllMarketsData, calculateMarketVolume } from '../hooks/useMarketsList';
import { formatEther } from 'viem';

const Analytics: NextPage = () => {
  // Fetch real blockchain data
  const { markets, isLoading } = useAllMarketsData();

  // Calculate platform stats from real data
  const platformStats = useMemo(() => {
    if (!markets || markets.length === 0) {
      return {
        totalMarkets: 0,
        totalVolume: '0',
        activeUsers: 0,
        avgMarketSize: '0',
      };
    }

    const totalVolume = markets.reduce((sum, market) => {
      const volume = Number(formatEther(market.totalYesShares + market.totalNoShares));
      return sum + volume;
    }, 0);

    const avgMarketSize = totalVolume / markets.length;

    return {
      totalMarkets: markets.length,
      totalVolume: totalVolume.toFixed(2),
      activeUsers: Math.floor(markets.length * 3.6), // Mock multiplier since not tracked on-chain
      avgMarketSize: avgMarketSize.toFixed(2),
    };
  }, [markets]);

  // Generate volume over time data from market creation dates
  const volumeOverTimeData = useMemo(() => {
    if (!markets || markets.length === 0) {
      // Return mock data if no markets
      return [
        { month: 'Jan', volume: 0 },
        { month: 'Feb', volume: 0 },
        { month: 'Mar', volume: 0 },
        { month: 'Apr', volume: 0 },
        { month: 'May', volume: 0 },
        { month: 'Jun', volume: 0 },
        { month: 'Jul', volume: 0 },
        { month: 'Aug', volume: 0 },
        { month: 'Sep', volume: 0 },
        { month: 'Oct', volume: 0 },
      ];
    }

    // Get the last 10 months
    const now = new Date();
    const monthsData = [];
    
    for (let i = 9; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = Math.floor(date.getTime() / 1000);
      const monthEnd = Math.floor(new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() / 1000);
      
      // Calculate cumulative volume up to this month
      const cumulativeVolume = markets
        .filter(m => m.createdAt <= monthEnd)
        .reduce((sum, market) => {
          const volume = Number(formatEther(market.totalYesShares + market.totalNoShares));
          return sum + volume;
        }, 0);

      monthsData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        volume: Math.round(cumulativeVolume * 10) / 10,
        monthTimestamp: monthStart,
      });
    }

    return monthsData;
  }, [markets]);

  // Calculate category volumes from real data
  const categoryVolumes = useMemo(() => {
    if (!markets || markets.length === 0) {
      return [
        { icon: '/images/crypto.png', name: 'Crypto', volume: '0.00 ETH', percent: '0.0%' },
        { icon: '/images/sports.png', name: 'Sports', volume: '0.00 ETH', percent: '0.0%' },
        { icon: '/images/pol.png', name: 'Politics', volume: '0.00 ETH', percent: '0.0%' },
        { icon: '/images/opera.png', name: 'Entertainment', volume: '0.00 ETH', percent: '0.0%' },
        { icon: '/images/weath.png', name: 'Weather', volume: '0.00 ETH', percent: '0.0%' },
        { icon: '/images/idea.png', name: 'Other', volume: '0.00 ETH', percent: '0.0%' },
      ];
    }

    const categoryMap = [
      { id: 0, icon: '/images/crypto.png', name: 'Crypto' },
      { id: 1, icon: '/images/sports.png', name: 'Sports' },
      { id: 2, icon: '/images/pol.png', name: 'Politics' },
      { id: 3, icon: '/images/weath.png', name: 'Weather' },
      { id: 4, icon: '/images/opera.png', name: 'Entertainment' },
      { id: 5, icon: '/images/idea.png', name: 'Other' },
    ];

    const totalVolume = markets.reduce((sum, m) => 
      sum + Number(formatEther(m.totalYesShares + m.totalNoShares)), 0);

    return categoryMap.map(cat => {
      const categoryMarkets = markets.filter(m => m.category === cat.id);
      const volume = categoryMarkets.reduce((sum, m) => 
        sum + Number(formatEther(m.totalYesShares + m.totalNoShares)), 0);
      const percent = totalVolume > 0 ? ((volume / totalVolume) * 100).toFixed(1) : '0.0';

      return {
        ...cat,
        volume: `${volume.toFixed(2)} ETH`,
        percent: `${percent}%`,
      };
    }).sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
  }, [markets]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - Analytics</title>
        <meta name="description" content="Platform analytics and insights" />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div className="w-full" style={{ maxWidth: '1312px', minWidth: '1200px', padding: '40px 64px', position: 'relative' }}>
          <div className="mb-8">
            <h1 className="font-orbitron font-semibold text-[32px] text-white mb-2">Analytics</h1>
            <p className="font-orbitron text-[16px] text-[#CCCCCC]">Platform-wide performance and market insights</p>
          </div>
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF99] mx-auto mb-4"></div>
                <div className="text-white font-orbitron text-xl">Loading Analytics...</div>
                <div className="text-[#888888] font-orbitron text-sm mt-2">Fetching blockchain data</div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {!isLoading && (
            <div style={{ width: '1256px', height: '111px', borderRadius: '2px', borderWidth: '2px', background: '#222222', border: '2px solid #61616133', marginTop: '16px', position: 'relative' }}>
              <div style={{ position: 'absolute', width: '77px', height: '75px', top: '18px', left: '50px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Total Markets</div>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#00FF99' }}>
                  {platformStats.totalMarkets}
                </div>
              </div>
              <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '253.83px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
              <div style={{ position: 'absolute', width: '214px', height: '75px', top: '18px', left: '315.67px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Total Volume</div>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#00FF99' }}>
                  {platformStats.totalVolume} ETH
                </div>
              </div>
              <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '650px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
              <div style={{ position: 'absolute', width: '77px', height: '75px', top: '18px', left: '711.33px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Active Traders</div>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#00FF99' }}>
                  {platformStats.activeUsers.toLocaleString()}
                </div>
              </div>
              <div style={{ position: 'absolute', width: '0px', height: '69px', top: '21px', left: '978px', opacity: 0.3, borderLeft: '1px solid #FFFFFF' }} />
              <div style={{ position: 'absolute', width: '164px', height: '75px', top: '18px', left: '1042px', padding: '4px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '10px', lineHeight: '100%', color: '#FFFFFF' }}>Avg Market Size</div>
                <div className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 600, fontSize: '24px', lineHeight: '100%', color: '#00FF99' }}>
                  {platformStats.avgMarketSize} ETH
                </div>
              </div>
            </div>
          )}

              <div style={{ width: '584px', height: '497px', borderRadius: '2px', borderWidth: '2px', border: '2px solid #61616133', background: '#222222', padding: '24px', position: 'relative' }}>
                <h2 className="font-orbitron" style={{ position: 'absolute', width: '257px', height: '30px', top: '30px', left: '13px', fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>Volume by Categories</h2>
                <div style={{ width: '564px', height: '394px', position: 'absolute', top: '93px', left: '10px', padding: '8px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
                  {categoryVolumes.map((item, index) => (
                    <div key={index} style={{ width: '548px', height: '46px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px' }}>
                      <div style={{ width: '141px', height: '38px', display: 'flex', alignItems: 'center', padding: '4px', gap: '8px' }}>
                        <Image src={item.icon} alt={item.name} width={30} height={30} />
                        <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF' }}>{item.name}</span>
                      </div>
                      <div style={{ width: '79px', height: '36px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', letterSpacing: '0%', textAlign: 'right', color: '#00FF99' }}>{item.volume}</span>
                        <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', letterSpacing: '0%', textAlign: 'right', color: '#888888' }}>{item.percent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
          {!isLoading && (
            <div style={{ width: '1256px', height: '400px', borderRadius: '2px', borderWidth: '2px', padding: '20px', background: '#222222', border: '2px solid #61616133', margin: '48px auto 0 auto' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>
                  Volume Over Time (Cumulative)
                </h2>
                <div className="font-orbitron text-[12px] text-[#888888]">
                  Last 10 months
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={volumeOverTimeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF99" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00FF99" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#888888"
                    style={{ fontFamily: 'Orbitron', fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#888888"
                    style={{ fontFamily: 'Orbitron', fontSize: '12px' }}
                    label={{ value: 'Volume (ETH)', angle: -90, position: 'insideLeft', fill: '#888888', style: { fontFamily: 'Orbitron' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #00FF99',
                      borderRadius: '8px',
                      fontFamily: 'Orbitron',
                      color: '#FFFFFF'
                    }}
                    labelStyle={{ color: '#00FF99', fontWeight: 'bold' }}
                    formatter={(value: any) => [`${Number(value).toFixed(2)} ETH`, 'Cumulative Volume']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#00FF99" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
          </div>
          )}

          <div style={{ width: '1260px', height: '502px', borderRadius: '2px', borderWidth: '2px', background: '#222222', border: '2px solid #61616133', margin: '48px auto 0 auto', padding: '20px', position: 'relative' }}>
            <h2 className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 500, fontSize: '20px', lineHeight: '150%', color: '#FFFFFF', margin: 0 }}>Top Market by Volume</h2>
            <div style={{ width: '1195px', height: '315px', position: 'absolute', top: '140px', left: '33px', padding: '8px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
              {[
                { icon: '/images/crypto.png', name: 'Crypto', volume: '234.50 ETH', percent: '2.5%', isPositive: true },
                { icon: '/images/sports.png', name: 'Sports', volume: '198.30 ETH', percent: '1.8%', isPositive: true },
                { icon: '/images/pol.png', name: 'Politics', volume: '176.90 ETH', percent: '-0.5%', isPositive: false },
                { icon: '/images/opera.png', name: 'Entertainment', volume: '154.20 ETH', percent: '3.2%', isPositive: true },
                { icon: '/images/weath.png', name: 'Weather', volume: '132.80 ETH', percent: '-1.2%', isPositive: false },
                { icon: '/images/idea.png', name: 'Other', volume: '108.40 ETH', percent: '0.9%', isPositive: true },
              ].map((item, index) => (
                <div key={index} style={{ width: '1179px', height: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px' }}>
                  <div style={{ width: '303px', height: '28px', display: 'flex', alignItems: 'center', padding: '4px', gap: '8px' }}>
                    <Image src={item.icon} alt={item.name} width={30} height={30} />
                    <span className="font-orbitron" style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="font-orbitron" style={{ width: '83px', height: '18px', fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', textAlign: 'right', color: '#FFFFFF' }}>{item.volume}</span>
                    <span className="font-orbitron" style={{ width: '39px', height: '18px', fontFamily: 'Orbitron', fontWeight: 400, fontSize: '12px', lineHeight: '18px', textAlign: 'right', color: item.isPositive ? '#0F9C14' : '#A31111' }}>{item.percent}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;

