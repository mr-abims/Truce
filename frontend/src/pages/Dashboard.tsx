import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { formatEther, type Address } from 'viem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResolveMarketModal from '../components/ResolveMarketModal';
import { useAllMarketsData, getCategoryName, calculateMarketVolume, formatMarketDate } from '../hooks/useMarketsList';
import { useGetUserShares, useGetLPTokenBalance, useGetAccumulatedFees } from '../hooks/useTruceMarket';
import { Outcome, MarketState } from '../config/contracts';

type TabType = 'overview' | 'my-markets' | 'trading-positions' | 'lp-positions';

interface ResolveModalData {
  address: Address;
  question: string;
  category: string;
  categoryIcon: string;
  resolutionDeadline: number;
  state: MarketState;
  createdAt: number;
}

// Category icon mapping (matches CreateForm)
const getCategoryIconPath = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    'Sports': '/images/sports.png',
    'Politics': '/images/pol.png',
    'Entertainment': '/images/opera.png',
    'Weather': '/images/weath.png',
    'Other': '/images/idea.png',
    'Crypto': '/images/crypto.png',
  };
  return iconMap[categoryName] || '/images/idea.png';
};

const Dashboard: NextPage = () => {
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const activitiesPerPage = 4;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedMarketForResolve, setSelectedMarketForResolve] = useState<ResolveModalData | null>(null);
  
  // Get user account
  const { address: userAddress, isConnected } = useAccount();
  
  // Fetch all markets
  const { markets: allMarkets, isLoading: isLoadingMarkets } = useAllMarketsData();
  
  // Categorize markets by user interaction
  const categorizedMarkets = useMemo(() => {
    if (!userAddress || !allMarkets.length) {
      return {
        createdByUser: [],
        withLPPositions: [],
        withTradingPositions: [],
      };
    }
    
    console.log('📊 Dashboard All Markets Data:', allMarkets.map(m => ({
      question: m.question,
      state: m.state,
      stateType: typeof m.state,
      address: m.address,
    })));
    
    const createdByUser = allMarkets.filter(
      m => m.creator?.toLowerCase() === userAddress.toLowerCase()
    );
    
    console.log('👤 Markets Created By User:', createdByUser.map(m => ({
      question: m.question,
      state: m.state,
      stateType: typeof m.state,
    })));
    
    // For now, we'll mark all markets as potential LP/trading positions
    // In reality, we'd need to fetch user shares for each market
    const withLPPositions = allMarkets; // Will filter based on LP balance > 0
    const withTradingPositions = allMarkets; // Will filter based on YES/NO shares > 0
    
    return {
      createdByUser,
      withLPPositions,
      withTradingPositions,
    };
  }, [userAddress, allMarkets]);
  
  // Calculate user's active positions and stats
  const userPositions = useMemo(() => {
    if (!userAddress || !allMarkets.length) return [];
    
    const positions = allMarkets.map(market => {
      // We'll need to fetch user shares for each market
      // For now, return market info - we'll enhance this
      return {
        marketAddress: market.address,
        question: market.question,
        category: market.category,
        yesShares: BigInt(0),
        noShares: BigInt(0),
        totalYesShares: market.totalYesShares,
        totalNoShares: market.totalNoShares,
        resolutionDeadline: market.resolutionDeadline,
        state: market.state,
      };
    });
    
    return positions;
  }, [userAddress, allMarkets]);
  
  // Calculate portfolio stats
  const portfolioStats = useMemo(() => {
    if (!userPositions.length) {
      return {
        totalValue: '0',
        activePredictions: 0,
        totalPotentialPayout: '0',
        winRate: 0,
        wins: 0,
        losses: 0,
        netProfit: '0',
        marketsCreated: categorizedMarkets.createdByUser.length,
        lpPositionsCount: 0, // Will be calculated when we fetch LP balances
        tradingPositionsCount: 0, // Will be calculated when we fetch shares
      };
    }
    
    // Calculate stats based on user's positions
    let totalValue = BigInt(0);
    let activePredictions = 0;
    let totalPotentialPayout = BigInt(0);
    
    userPositions.forEach(pos => {
      const hasYes = pos.yesShares > BigInt(0);
      const hasNo = pos.noShares > BigInt(0);
      
      if (hasYes || hasNo) {
        activePredictions++;
        
        // Current value calculation (simplified - actual value would depend on current price)
        const userYesValue = pos.yesShares;
        const userNoValue = pos.noShares;
        totalValue += userYesValue + userNoValue;
        
        // Potential payout (if the user's position wins, they get total shares)
        if (hasYes) {
          totalPotentialPayout += pos.totalYesShares + pos.totalNoShares;
        }
        if (hasNo) {
          totalPotentialPayout += pos.totalYesShares + pos.totalNoShares;
        }
      }
    });
    
    return {
      totalValue: formatEther(totalValue),
      activePredictions,
      totalPotentialPayout: formatEther(totalPotentialPayout),
      winRate: 0, // Will need resolved markets to calculate
      wins: 0,
      losses: 0,
      netProfit: '0',
      marketsCreated: categorizedMarkets.createdByUser.length,
      lpPositionsCount: 0, // Will be calculated when we fetch LP balances
      tradingPositionsCount: activePredictions,
    };
  }, [userPositions, categorizedMarkets.createdByUser.length]);
  
  // Mock data for demonstration (to be replaced with real data)
  const mockActivePositions = [
    // Bitcoin prediction - headline.png
    {
      id: 'p1',
      type: 'headline',
      question: 'Bitcoin price',
      time: '2 hours ago',
      profit: '+$500',
    },
    // Ethereum prediction - downline.png
    {
      id: 'p2',
      type: 'downline',
      question: 'Ethereum price',
      time: '4 hours ago',
      profit: '-$250',
    },
    // Sports prediction - headline.png
    {
      id: 'p3',
      type: 'headline',
      question: 'Lakers vs Warriors',
      time: '1 day ago',
      profit: '+$120',
    },
    // Politics prediction - downline.png
    {
      id: 'p4',
      type: 'downline',
      question: 'Election outcome',
      time: '3 days ago',
      profit: '-$80',
    },
    // User created prediction - create.png
    {
      id: 'p5',
      type: 'create',
      question: 'Nigeria World Cup Qualification',
      time: '1 week ago',
      profit: '+$300',
    },
    // Weather prediction - headline.png
    {
      id: 'p6',
      type: 'headline',
      question: 'Weather forecast',
      time: '5 days ago',
      profit: '+$75',
    },
  ];

  // Calculate pagination for activities
  const totalActivityPages = Math.ceil(mockActivePositions.length / activitiesPerPage);
  const startActivityIndex = (currentActivityPage - 1) * activitiesPerPage;
  const endActivityIndex = startActivityIndex + activitiesPerPage;
  const currentActivities = mockActivePositions.slice(startActivityIndex, endActivityIndex);

  const handleActivityPrevPage = () => {
    setCurrentActivityPage(prev => Math.max(prev - 1, 1));
  };

  const handleActivityNextPage = () => {
    setCurrentActivityPage(prev => Math.min(prev + 1, totalActivityPages));
  };

  const goToActivityPage = (page: number) => {
    setCurrentActivityPage(page);
  };

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
          <div 
            style={{
              width: '1256px',
              height: '133px',
              borderRadius: '2px',
              borderWidth: '2px',
              opacity: 1,
              background: '#222222',
              border: '2px solid #61616133',
              position: 'relative',
              marginBottom: '40px',
            }}
          >
            {/* Contents Container */}
            <div
              style={{
                width: '1146px',
                height: '114px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: 1,
                position: 'absolute',
                top: '10px',
                left: '55px',
                padding: '8px',
              }}
            >
              {/* 1st Content - Portfolio Value */}
              <div
                style={{
                  width: '167px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Portfolio Value</div>
                <div className="font-orbitron text-[28px] font-bold text-white">
                  {isConnected ? `${parseFloat(portfolioStats.totalValue).toFixed(4)} ETH` : '---'}
                </div>
                <div className="font-orbitron text-[14px] font-bold text-[#CCCCCC]">
                  {isConnected ? `${allMarkets.length} Markets` : 'Connect Wallet'}
                </div>
              </div>

              {/* 2nd Content - Active Predictions */}
              <div
                style={{
                  width: '157px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Active Predictions</div>
                <div className="font-orbitron text-[28px] font-bold text-white">
                  {isConnected ? portfolioStats.activePredictions : '---'}
                </div>
                <div className="font-orbitron text-[12px] text-[#CCCCCC]">
                  {isConnected ? `Potential: ${parseFloat(portfolioStats.totalPotentialPayout).toFixed(4)} ETH` : 'No data'}
                </div>
              </div>

              {/* 3rd Content - Win Rate */}
              <div
                style={{
                  width: '111px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Win Rate</div>
                <div className="font-orbitron text-[28px] font-bold text-white">
                  {isConnected && (portfolioStats.wins + portfolioStats.losses) > 0
                    ? `${((portfolioStats.wins / (portfolioStats.wins + portfolioStats.losses)) * 100).toFixed(1)}%`
                    : '---'}
                </div>
                <div className="font-orbitron text-[12px] text-[#CCCCCC]">
                  {isConnected ? `${portfolioStats.wins} Won / ${portfolioStats.losses} Lost` : 'No data'}
                </div>
              </div>

              {/* 4th Content - Net Profit */}
              <div
                style={{
                  width: '95px',
                  height: '98px',
                  opacity: 1,
                  padding: '4px',
                  gap: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">Net Profit</div>
                <div className={`font-orbitron text-[28px] font-bold ${parseFloat(portfolioStats.netProfit) >= 0 ? 'text-[#00FF99]' : 'text-[#FF3366]'}`}>
                  {isConnected ? `${parseFloat(portfolioStats.netProfit) >= 0 ? '+' : ''}${parseFloat(portfolioStats.netProfit).toFixed(4)} ETH` : '---'}
                </div>
                <div className="font-orbitron text-[12px] text-[#CCCCCC]">
                  {isConnected ? `Total Volume: ${parseFloat(portfolioStats.totalValue).toFixed(4)} ETH` : 'No data'}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Matches Markets page filter style */}
          <div
            className="flex items-center mb-8"
            style={{
              width: '820px',
              height: '38px',
              borderRadius: '6px',
              justifyContent: 'space-between',
              opacity: 1,
              background: '#1A1A1A',
              padding: '4px',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setActiveTab('overview')}
              className="font-orbitron transition-all duration-200 hover:opacity-80"
              style={{
                fontFamily: 'Orbitron',
                fontSize: '14px',
                fontWeight: activeTab === 'overview' ? 700 : 400,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                background: activeTab === 'overview' ? '#00FF99' : 'transparent',
                color: activeTab === 'overview' ? '#000000' : '#FFFFFF',
                cursor: 'pointer',
                flex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('my-markets')}
              className="font-orbitron transition-all duration-200 hover:opacity-80"
              style={{
                fontFamily: 'Orbitron',
                fontSize: '14px',
                fontWeight: activeTab === 'my-markets' ? 700 : 400,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                background: activeTab === 'my-markets' ? '#00FF99' : 'transparent',
                color: activeTab === 'my-markets' ? '#000000' : '#FFFFFF',
                cursor: 'pointer',
                flex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              My Markets ({portfolioStats.marketsCreated})
            </button>
            <button
              onClick={() => setActiveTab('trading-positions')}
              className="font-orbitron transition-all duration-200 hover:opacity-80"
              style={{
                fontFamily: 'Orbitron',
                fontSize: '14px',
                fontWeight: activeTab === 'trading-positions' ? 700 : 400,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                background: activeTab === 'trading-positions' ? '#00FF99' : 'transparent',
                color: activeTab === 'trading-positions' ? '#000000' : '#FFFFFF',
                cursor: 'pointer',
                flex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Trading ({portfolioStats.tradingPositionsCount})
            </button>
            <button
              onClick={() => setActiveTab('lp-positions')}
              className="font-orbitron transition-all duration-200 hover:opacity-80"
              style={{
                fontFamily: 'Orbitron',
                fontSize: '14px',
                fontWeight: activeTab === 'lp-positions' ? 700 : 400,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                background: activeTab === 'lp-positions' ? '#00FF99' : 'transparent',
                color: activeTab === 'lp-positions' ? '#000000' : '#FFFFFF',
                cursor: 'pointer',
                flex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              LP ({portfolioStats.lpPositionsCount})
            </button>
          </div>

          {/* Tab Content - Overview */}
          {activeTab === 'overview' && (
          <>
          {/* Recent Activity Container */}
          <div
            style={{
              width: '1256px',
              height: '619px',
              borderRadius: '2px',
              border: '1px solid #B3B3B380',
              opacity: 1,
              padding: '24px',
            }}
          >
            {/* Recent Activity Header */}
            <div
              style={{
                width: '191px',
                height: '61px',
                borderRadius: '12px',
                gap: '10px',
                paddingTop: '4px',
                paddingRight: '8px',
                paddingBottom: '4px',
                paddingLeft: '8px',
                opacity: 1,
                marginBottom: '24px',
              }}
            >
              <h2
                className="font-orbitron"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Recent Markets
              </h2>
            </div>

            {/* Active Positions - Show real markets */}
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {!isConnected ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-xl mb-4">
                      🔐 Connect Your Wallet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      Connect your wallet to see your activity
                    </div>
                  </div>
                </div>
              ) : isLoadingMarkets ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF99] mx-auto mb-4"></div>
                    <div className="text-white font-orbitron text-xl">Loading Markets...</div>
                    <div className="text-[#888888] font-orbitron text-sm mt-2">Fetching from blockchain</div>
                  </div>
                </div>
              ) : allMarkets.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-xl mb-4">
                      📭 No Markets Yet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      No markets have been created yet
                    </div>
                  </div>
                </div>
              ) : (
                currentActivities.map((pos) => {
                  // Find corresponding real market
                  const realMarket = allMarkets[mockActivePositions.indexOf(pos)] || allMarkets[0];
                  const categoryName = getCategoryName(realMarket?.category || 0, realMarket?.question);
                  const categoryIconPath = getCategoryIconPath(categoryName);
                  
                  return (
                <Link href={`/market/${realMarket?.address || '#'}`} key={pos.id}>
                  <div
                    className="cursor-pointer relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,153,0.4)] hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                      width: '1171px',
                      height: '90px',
                      borderRadius: '8px',
                      opacity: 1,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      border: '1px solid #2A2A2A',
                    }}
                  >
                    {/* Category Icon - Smaller for overview */}
                    <div 
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '6px',
                        background: 'rgba(0, 255, 153, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(0, 255, 153, 0.15)',
                      }}
                    >
                      <Image 
                        src={categoryIconPath} 
                        alt={categoryName} 
                        width={32} 
                        height={32}
                        style={{ opacity: 0.9 }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Question */}
                      <div 
                        className="font-orbitron text-white"
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 600,
                          fontSize: '15px',
                          lineHeight: '120%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '900px',
                        }}
                      >
                        {realMarket?.question || pos.question}
                      </div>
                      
                      {/* Category & Stats */}
                      <div className="flex items-center gap-3">
                        <span 
                          className="font-orbitron text-[10px] px-2 py-1 rounded" 
                          style={{ 
                            background: 'rgba(0, 102, 204, 0.12)', 
                            color: '#00AAFF',
                            fontWeight: 600,
                          }}
                        >
                          {categoryName.toUpperCase()}
                        </span>
                        <span style={{ color: '#444444' }}>•</span>
                        <span 
                          className="font-orbitron"
                          style={{
                            fontFamily: 'Orbitron',
                            fontWeight: 400,
                            fontSize: '12px',
                            color: '#888888',
                          }}
                        >
                          Volume: <span style={{ color: '#00FF99', fontWeight: 700 }}>{calculateMarketVolume(realMarket || { totalYesShares: BigInt(0), totalNoShares: BigInt(0) })} ETH</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* View Button */}
                    <div
                      className="font-orbitron"
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(0, 255, 153, 0.08)',
                        border: '1px solid rgba(0, 255, 153, 0.3)',
                        borderRadius: '6px',
                        fontFamily: 'Orbitron',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: '#00FF99',
                        flexShrink: 0,
                      }}
                    >
                      View
                    </div>
                  </div>
                </Link>
              );
                })
              )}
            </div>

            {/* Activity Pagination */}
            <div
              style={{
                width: '100%',
                height: '56px',
                padding: '8px',
                gap: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '8px',
              }}
            >
              <button
                onClick={handleActivityPrevPage}
                disabled={currentActivityPage === 1}
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: currentActivityPage === 1 ? '#666666' : '#CCCCCC',
                  cursor: currentActivityPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ←
              </button>
              
              {Array.from({ length: totalActivityPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToActivityPage(page)}
                  className="font-orbitron"
                  style={{
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '4px',
                    background: page === currentActivityPage ? '#00FF99' : 'transparent',
                    color: page === currentActivityPage ? '#000000' : '#FFFFFF',
                    fontFamily: 'Orbitron',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={handleActivityNextPage}
                disabled={currentActivityPage === totalActivityPages}
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: currentActivityPage === totalActivityPages ? '#666666' : '#CCCCCC',
                  cursor: currentActivityPage === totalActivityPages ? 'not-allowed' : 'pointer',
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Active Prediction Container */}
          <div
            style={{
              width: '1256px',
              height: '800px',
              opacity: 1,
              borderRadius: '2px',
              border: '1px solid #B3B3B380',
              marginTop: '24px',
              padding: '32px 34px',
            }}
          >
            <div
              style={{
                width: '183px',
                height: '40px',
                opacity: 1,
                padding: '10px',
                gap: '10px',
                marginBottom: '40px',
              }}
            >
              <h2
                className="font-orbitron"
                style={{
                  fontFamily: 'Orbitron',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Your Active Positions
              </h2>
            </div>

            {/* Empty State or Table Content */}
            {!isConnected ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="text-white font-orbitron text-2xl mb-4">
                    🔐 Connect Your Wallet
                  </div>
                  <div className="text-[#888888] font-orbitron text-sm">
                    Connect your wallet to view your active positions and track your predictions
                  </div>
                </div>
              </div>
            ) : portfolioStats.activePredictions === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="text-white font-orbitron text-2xl mb-4">
                    📊 No Active Positions Yet
                  </div>
                  <div className="text-[#888888] font-orbitron text-sm mb-6">
                    Start trading on prediction markets to see your positions here
                  </div>
                  <Link href="/Markets">
                    <button
                      className="font-orbitron px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-80"
                      style={{
                        background: '#00FF99',
                        color: '#000000',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Explore Markets
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
            {/* Table Header */}
            <div
              style={{
                width: '1171px',
                height: '40px',
                opacity: 1,
                borderRadius: '2px',
                marginTop: '48px',
                marginLeft: '42px',
                padding: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Market Header */}
              <div
                style={{
                  width: '200px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Market
                </div>
              </div>

              {/* Prediction Header */}
              <div
                style={{
                  width: '100px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Prediction
                </div>
              </div>

              {/* Amount Header */}
              <div
                style={{
                  width: '120px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Amount
                </div>
              </div>

              {/* Potential Payout Header */}
              <div
                style={{
                  width: '150px',
                  height: '40px',
                  padding: '4px',
                  gap: '14px',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="font-orbitron"
                  style={{
                    fontFamily: 'Orbitron',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#CCCCCC',
                    margin: 0,
                  }}
                >
                  Potential Payout
                </div>
              </div>
            </div>

            {/* Data Container */}
            <div
              style={{
                width: '1255px',
                height: '457px',
                opacity: 1,
                borderRadius: '2px',
                position: 'relative',
                marginTop: '12px',
              }}
            >

              {/* Data Rows */}
              <div
                style={{
                  position: 'absolute',
                  width: '1171px',
                  height: '102px',
                  top: '100px',
                  left: '42px',
                  padding: '8px',
                  opacity: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #B3B3B380',
                }}
              >
                {/* Market Column */}
                <div style={{width: '200px', height: '52px', padding: '4px', gap: '14px', opacity: 1, display: 'flex', flexDirection: 'column'}}>
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    Bitcoin price
                  </div>
                </div>

                {/* Prediction Column */}
                <div
                  style={{
                    width: '100px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', color: '#1AB412', margin: 0}}>
                    up
                  </div>
                </div>

                {/* Amount Column */}
                <div
                  style={{
                    width: '120px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $500
                  </div>
                </div>

                {/* Potential Payout Column */}
                <div
                  style={{
                    width: '150px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $1000
                  </div>
                </div>
              </div>

              {/* Second row */}
              <div
                style={{
                  position: 'absolute',
                  width: '1171px',
                  height: '102px',
                  top: '220px',
                  left: '42px',
                  padding: '8px',
                  opacity: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #B3B3B380',
                }}
              >
                {/* Market Column */}
                <div style={{width: '200px', height: '52px', padding: '4px', gap: '14px', opacity: 1, display: 'flex', flexDirection: 'column'}}>
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    Ethereum price
                  </div>
                </div>

                {/* Prediction Column */}
                <div
                  style={{
                    width: '100px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', color: '#FF3366', margin: 0}}>
                    down
                  </div>
                </div>

                {/* Amount Column */}
                <div
                  style={{
                    width: '120px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $300
                  </div>
                </div>

                {/* Potential Payout Column */}
                <div
                  style={{
                    width: '150px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $600
                  </div>
                </div>
              </div>

              {/* Third row */}
              <div
                style={{
                  position: 'absolute',
                  width: '1171px',
                  height: '102px',
                  top: '340px',
                  left: '42px',
                  padding: '8px',
                  opacity: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #B3B3B380',
                }}
              >
                {/* Market Column */}
                <div style={{width: '200px', height: '52px', padding: '4px', gap: '14px', opacity: 1, display: 'flex', flexDirection: 'column'}}>
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    Sports match
                  </div>
                </div>

                {/* Prediction Column */}
                <div
                  style={{
                    width: '100px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', color: '#FF3366', margin: 0}}>
                    down
                  </div>
                </div>

                {/* Amount Column */}
                <div
                  style={{
                    width: '120px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $150
                  </div>
                </div>

                {/* Potential Payout Column */}
                <div
                  style={{
                    width: '150px',
                    height: '52px',
                    padding: '4px',
                    gap: '14px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="font-orbitron" style={{fontFamily: 'Orbitron', fontWeight: 500, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', color: '#FFFFFF', margin: 0}}>
                    $300
                  </div>
                </div>
              </div>
            </div>
            </>
            )}

            {/* Active Prediction Pagination - Only show if there are positions */}
            {isConnected && portfolioStats.activePredictions > 0 && (
            <div
              style={{
                width: '100%',
                height: '56px',
                padding: '8px',
                gap: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '24px',
              }}
            >
              <button
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: '#CCCCCC',
                  cursor: 'pointer',
                }}
              >
                ←
              </button>
              
              <button
                className="font-orbitron"
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#00FF99',
                  color: '#000000',
                  fontFamily: 'Orbitron',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                1
              </button>
              
              <button
                style={{
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  background: 'transparent',
                  color: '#CCCCCC',
                  cursor: 'pointer',
                }}
              >
                →
              </button>
            </div>
            )}
          </div>
          </>
          )}

          {/* Tab Content - My Markets */}
          {activeTab === 'my-markets' && (
            <div
              style={{
                width: '1256px',
                minHeight: '600px',
                borderRadius: '2px',
                border: '1px solid #B3B3B380',
                padding: '32px',
              }}
            >
              <h2 className="font-orbitron text-[18px] font-semibold text-white mb-6">
                Markets Created by You
              </h2>
              
              {!isConnected ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-2xl mb-4">
                      🔐 Connect Your Wallet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      Connect your wallet to view the markets you&apos;ve created
                    </div>
                  </div>
                </div>
              ) : categorizedMarkets.createdByUser.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-2xl mb-4">
                      📭 No Markets Created Yet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm mb-6">
                      Create your first prediction market and earn fees from traders
                    </div>
                    <Link href="/Create">
                      <button
                        className="font-orbitron px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-80"
                        style={{
                          background: '#00FF99',
                          color: '#000000',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Create First Market
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: '16px' }}>
                  {categorizedMarkets.createdByUser.map((market) => {
                    const categoryName = getCategoryName(market.category, market.question);
                    const categoryIconPath = getCategoryIconPath(categoryName);
                    const volume = calculateMarketVolume(market);
                    const endsDate = formatMarketDate(market.resolutionDeadline);
                    
                    return (
                      <Link href={`/market/${market.address}`} key={market.address}>
                        <div
                          className="cursor-pointer relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,153,0.4)] hover:scale-[1.01]"
                          style={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                            width: '1241px',
                            height: '120px',
                            borderRadius: '8px',
                            opacity: 1,
                            padding: '20px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            border: '1px solid #2A2A2A',
                          }}
                        >
                          {/* Category Icon */}
                          <div 
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: '8px',
                              background: 'rgba(0, 255, 153, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              border: '1px solid rgba(0, 255, 153, 0.2)',
                            }}
                          >
                            <Image 
                              src={categoryIconPath} 
                              alt={categoryName} 
                              width={45} 
                              height={45}
                              style={{ opacity: 0.9 }}
                            />
                          </div>
                          
                          {/* Content Column */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {/* Title Row with Status */}
                            <div className="flex items-center gap-3">
                              <div 
                                className="font-orbitron text-white"
                                style={{
                                  fontFamily: 'Orbitron',
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  lineHeight: '120%',
                                  maxWidth: '750px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {market.question}
                              </div>
                              <span 
                                className="font-orbitron text-[10px] px-3 py-1 rounded" 
                                style={{
                                  background: market.state === MarketState.Active ? 'rgba(0, 255, 153, 0.15)' :
                                             market.state === MarketState.Resolved ? 'rgba(0, 170, 255, 0.15)' :
                                             'rgba(255, 51, 102, 0.15)',
                                  color: market.state === MarketState.Active ? '#00FF99' :
                                         market.state === MarketState.Resolved ? '#00AAFF' :
                                         '#FF3366',
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {market.state === MarketState.Active ? '● ACTIVE' :
                                 market.state === MarketState.Resolved ? '✓ RESOLVED' :
                                 market.state === MarketState.PendingDispute ? '⏱ PENDING' :
                                 market.state === MarketState.Disputed ? '⚠ DISPUTED' : '✗ CANCELLED'}
                              </span>
                            </div>
                            
                            {/* Category Badge */}
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-orbitron text-[10px] px-2 py-1 rounded" 
                                style={{ 
                                  background: 'rgba(0, 102, 204, 0.15)', 
                                  color: '#00AAFF',
                                  fontWeight: 600,
                                }}
                              >
                                {categoryName.toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Stats Row */}
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="font-orbitron"
                                  style={{
                                    fontFamily: 'Orbitron',
                                    fontWeight: 400,
                                    fontSize: '13px',
                                    color: '#888888',
                                  }}
                                >
                                  Volume
                                </span>
                                <span 
                                  className="font-orbitron"
                                  style={{
                                    fontFamily: 'Orbitron',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: '#00FF99',
                                  }}
                                >
                                  {volume} ETH
                                </span>
                              </div>
                              
                              <div style={{ width: '1px', height: '16px', background: '#333' }} />
                              
                              <div className="flex items-center gap-2">
                                <span 
                                  className="font-orbitron"
                                  style={{
                                    fontFamily: 'Orbitron',
                                    fontWeight: 400,
                                    fontSize: '13px',
                                    color: '#888888',
                                  }}
                                >
                                  Trades
                                </span>
                                <span 
                                  className="font-orbitron"
                                  style={{
                                    fontFamily: 'Orbitron',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: '#FFFFFF',
                                  }}
                                >
                                  {market.tradeCount}
                                </span>
                              </div>
                              
                              <div style={{ width: '1px', height: '16px', background: '#333' }} />
                              
                              <div className="flex items-center gap-2">
                                <span 
                                  className="font-orbitron"
                                  style={{
                                    fontFamily: 'Orbitron',
                                    fontWeight: 400,
                                    fontSize: '13px',
                                    color: '#888888',
                                  }}
                                >
                                  Ends
                                </span>
                                <span 
                                  className="font-orbitron"
                                  style={{
                                    fontFamily: 'Orbitron',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: '#FFFFFF',
                                  }}
                                >
                                  {endsDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <div 
                            style={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px',
                              flexShrink: 0,
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('📋 Opening Resolve Modal with market data:', {
                                  address: market.address,
                                  question: market.question,
                                  state: market.state,
                                  stateType: typeof market.state,
                                  resolutionDeadline: market.resolutionDeadline,
                                  createdAt: market.createdAt,
                                });
                                setSelectedMarketForResolve({
                                  address: market.address as Address,
                                  question: market.question,
                                  category: categoryName,
                                  categoryIcon: categoryIconPath,
                                  resolutionDeadline: market.resolutionDeadline,
                                  state: market.state,
                                  createdAt: market.createdAt,
                                });
                                setResolveModalOpen(true);
                              }}
                              className="font-orbitron transition-all duration-200 hover:opacity-80"
                              style={{
                                padding: '10px 20px',
                                background: 'rgba(0, 255, 153, 0.1)',
                                border: '1px solid #00FF99',
                                borderRadius: '6px',
                                fontFamily: 'Orbitron',
                                fontWeight: 700,
                                fontSize: '13px',
                                color: '#00FF99',
                                cursor: 'pointer',
                              }}
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab Content - Trading Positions */}
          {activeTab === 'trading-positions' && (
            <div
              style={{
                width: '1256px',
                minHeight: '600px',
                borderRadius: '2px',
                border: '1px solid #B3B3B380',
                padding: '32px',
              }}
            >
              <h2 className="font-orbitron text-[18px] font-semibold text-white mb-6">
                Your Trading Positions (YES/NO Shares)
              </h2>
              
              {!isConnected ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-2xl mb-4">
                      🔐 Connect Your Wallet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      Connect your wallet to view your trading positions
                    </div>
                  </div>
                </div>
              ) : portfolioStats.tradingPositionsCount === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-2xl mb-4">
                      📊 No Trading Positions Yet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm mb-6">
                      Buy YES or NO shares in prediction markets to start trading
                    </div>
                    <Link href="/Markets">
                      <button
                        className="font-orbitron px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-80"
                        style={{
                          background: '#00FF99',
                          color: '#000000',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Explore Markets
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-xl mb-4">
                      Trading positions will be displayed here
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      Feature requires fetching user shares for each market - coming soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content - LP Positions */}
          {activeTab === 'lp-positions' && (
            <div
              style={{
                width: '1256px',
                minHeight: '600px',
                borderRadius: '2px',
                border: '1px solid #B3B3B380',
                padding: '32px',
              }}
            >
              <h2 className="font-orbitron text-[18px] font-semibold text-white mb-6">
                Your Liquidity Provider Positions
              </h2>
              
              {!isConnected ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-2xl mb-4">
                      🔐 Connect Your Wallet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      Connect your wallet to view your LP positions
                    </div>
                  </div>
                </div>
              ) : portfolioStats.lpPositionsCount === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-2xl mb-4">
                      💧 No LP Positions Yet
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm mb-6">
                      Provide liquidity to markets and earn trading fees. LP tokens represent your share of the pool.
                    </div>
                    <Link href="/Markets">
                      <button
                        className="font-orbitron px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-80"
                        style={{
                          background: '#00FF99',
                          color: '#000000',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Find Markets
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-white font-orbitron text-xl mb-4">
                      LP positions will be displayed here
                    </div>
                    <div className="text-[#888888] font-orbitron text-sm">
                      Feature requires fetching LP token balances for each market - coming soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Resolve Market Modal */}
      {selectedMarketForResolve && (
        <ResolveMarketModal
          isOpen={resolveModalOpen}
          onClose={() => {
            setResolveModalOpen(false);
            setSelectedMarketForResolve(null);
          }}
          market={selectedMarketForResolve}
          userAddress={userAddress}
        />
      )}
    </div>
  );
};

export default Dashboard;
