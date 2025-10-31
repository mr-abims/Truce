import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, type Address } from 'viem';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LPManager from '../../components/LPManager';
import { useGetMarketData, useGetUserShares, useBuyShares, useGetRecentTrades } from '../../hooks/useTruceMarket';
import { Outcome, MarketState } from '../../config/contracts';

// Mock data for development/testing
const mockMarkets: Record<string, any> = {
  'm1': {
    id: 'm1',
    title: 'Will Bitcoin reach $100,000 by end of 2025?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '2450',
    ends: 'Dec 15, 2025',
    trades: 834,
    users: 290,
    description: 'This market will resolve to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange (Coinbase, Binance, Kraken) by December 31, 2025, 23:59:59 UTC.',
    yesShares: 52.3,
    noShares: 47.7,
    liquidity: 4900,
  },
  'm2': {
    id: 'm2',
    title: 'Will Ethereum surpass $5,000 in November?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '1890',
    ends: 'Nov 30, 2025',
    trades: 621,
    users: 245,
    description: 'This market resolves YES if Ethereum reaches $5,000 or more on any major exchange during November 2025.',
    yesShares: 48.5,
    noShares: 51.5,
    liquidity: 3780,
  },
  'm3': {
    id: 'm3',
    title: 'Will HBAR reach $1 by Q1 2026?',
    category: 'Crypto',
    icon: '/images/crypto.png',
    volume: '1340',
    ends: 'Mar 31, 2026',
    trades: 478,
    users: 187,
    description: 'This market will resolve YES if HBAR token reaches or exceeds $1.00 USD before March 31, 2026.',
    yesShares: 35.2,
    noShares: 64.8,
    liquidity: 2680,
  },
};

// Helper to infer category from question text (for markets with invalid category stored)
const inferCategoryFromQuestion = (question: string): number => {
  const q = question.toLowerCase();
  
  // Sports keywords
  if (q.match(/\b(win|championship|ballondor|ballon d'or|podium|grand prix|nba|playoffs|sports|team|game|match|tournament|league|player)\b/)) {
    return 1; // Sports
  }
  
  // Politics keywords
  if (q.match(/\b(election|vote|president|government|politics|political|un|congress|senate|policy|law)\b/)) {
    return 2; // Politics
  }
  
  // Entertainment keywords
  if (q.match(/\b(grammy|oscar|award|movie|music|album|singer|artist|entertainment|celebrity|box office|release)\b/)) {
    return 4; // Entertainment
  }
  
  // Weather keywords
  if (q.match(/\b(weather|temperature|rain|snow|hurricane|storm|climate|forecast)\b/)) {
    return 3; // Weather
  }
  
  // Crypto keywords
  if (q.match(/\b(bitcoin|ethereum|crypto|token|blockchain|defi|btc|eth|price)\b/)) {
    return 0; // Crypto
  }
  
  return 5; // Other (default)
};

// Helper to get category name from enum
const getCategoryName = (categoryEnum: number, question?: string): string => {
  const categories = ['Crypto', 'Sports', 'Politics', 'Weather', 'Entertainment', 'Other'];
  
  // If category is invalid (like 3600) and we have a question, try to infer
  if ((categoryEnum < 0 || categoryEnum > 5) && question) {
    const inferredCategory = inferCategoryFromQuestion(question);
    console.warn('Invalid category detected, inferring from question:', {
      storedCategory: categoryEnum,
      question,
      inferredCategory,
      inferredName: categories[inferredCategory]
    });
    return categories[inferredCategory];
  }
  
  return categories[categoryEnum] || 'Other';
};

// Helper to get category icon
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Crypto': '/images/crypto.png',
    'Sports': '/images/sports.png',
    'Politics': '/images/politics.png',
    'Weather': '/images/weath.png',
    'Entertainment': '/images/opera.png',
    'Other': '/images/idea.png',
  };
  return icons[category] || '/images/idea.png';
};

// Helper to format date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper to format time ago
const formatTimeAgo = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const secondsAgo = now - timestamp;
  
  if (secondsAgo < 60) return 'Just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hr ago`;
  return `${Math.floor(secondsAgo / 86400)} days ago`;
};

const MarketDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { address: userAddress } = useAccount();
  
  // State for trading
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(Outcome.Yes);
  const [tradeAmount, setTradeAmount] = useState('');

  // Check if this is a blockchain market or mock market
  const isBlockchainMarket = id && typeof id === 'string' && id.startsWith('0x');
  const marketAddress = isBlockchainMarket ? (id as Address) : undefined;

  // Blockchain hooks
  const { marketData, isLoading: isLoadingMarket, refetch: refetchMarket } = useGetMarketData(marketAddress);
  const { yesShares, noShares, isLoading: isLoadingShares, refetch: refetchShares } = useGetUserShares(marketAddress, userAddress);
  const { buyShares, isPending: isBuying, isSuccess: buySuccess } = useBuyShares(marketAddress);
  const { trades, isLoading: isLoadingTrades } = useGetRecentTrades(marketAddress, 5);

  // Transform blockchain market data
  const getBlockchainMarket = () => {
    if (!marketData) return null;
    
    const data = marketData as any;
    
    // Extract category from contract data
    const categoryEnum = Number(data.category || 0);
    const question = data.question || 'Untitled Market';
    
    // Get category name - will infer from question if category is invalid
    const categoryName = getCategoryName(categoryEnum, question);
    
    // Calculate total volume
    const totalYesShares = BigInt(data.totalYesShares || 0);
    const totalNoShares = BigInt(data.totalNoShares || 0);
    const totalVolume = totalYesShares + totalNoShares;
    
    return {
      id: id as string,
      address: marketAddress,
      title: question,
      category: categoryName,
      categoryEnum: categoryEnum,
      icon: getCategoryIcon(categoryName),
      volume: formatEther(totalVolume),
      ends: formatDate(Number(data.resolutionDeadline)),
      trades: Number(data.tradeCount || 0),
      users: 0, // Not tracked on-chain
      description: `This market will resolve on ${formatDate(Number(data.resolutionDeadline))}.`,
      yesShares: totalYesShares,
      noShares: totalNoShares,
      liquidity: formatEther(totalVolume),
      state: data.state,
      createdAt: Number(data.createdAt),
      creator: data.creator,
      resolutionDeadline: Number(data.resolutionDeadline),
    };
  };

  // Get market data (blockchain or mock)
  const market = isBlockchainMarket ? getBlockchainMarket() : mockMarkets[id as string];

  // Refetch data on success
  useEffect(() => {
    if (buySuccess) {
      refetchMarket();
      refetchShares();
      setTradeAmount('');
    }
  }, [buySuccess, refetchMarket, refetchShares]);

  // Loading state
  if (isBlockchainMarket && isLoadingMarket) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF99] mx-auto mb-4"></div>
            <div className="text-white font-orbitron text-xl">Loading Market Data...</div>
            <div className="text-[#888888] font-orbitron text-sm mt-2">Fetching from blockchain</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Market not found
  if (!market) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-orbitron text-2xl mb-4">⚠️ Market Not Found</div>
            <div className="text-[#888888] font-orbitron text-sm mb-6">
              {isBlockchainMarket 
                ? 'Unable to load market data from blockchain' 
                : 'This market ID does not exist'}
            </div>
            <button
              onClick={() => router.push('/Markets')}
              className="font-orbitron px-6 py-3 rounded-lg transition-all duration-200"
              style={{ 
                background: '#00FF99',
                color: '#000000',
                fontWeight: 700,
              }}
            >
              ← Back to Markets
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getClosingText = (endDate: string): string => {
    const end = Date.parse(endDate);
    if (isNaN(end)) return 'Date TBA';
    const now = Date.now();
    if (end < now) return 'Ended';
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (daysLeft === 1) return 'Closes in 1 day';
    return `Closes in ${daysLeft} days`;
  };

  const calculateProbability = (yes: number, no: number) => {
    const total = yes + no;
    if (total === 0) return { yes: 50, no: 50 };
    return {
      yes: ((yes / total) * 100).toFixed(1),
      no: ((no / total) * 100).toFixed(1),
    };
  };

  const probability = calculateProbability(
    typeof market.yesShares === 'number' ? market.yesShares : Number(market.yesShares),
    typeof market.noShares === 'number' ? market.noShares : Number(market.noShares)
  );

  const handleBuy = async () => {
    if (!tradeAmount || !isBlockchainMarket) return;
    try {
      await buyShares(selectedOutcome, tradeAmount);
    } catch (error) {
      console.error('Buy error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - {market.title}</title>
        <meta name="description" content={market.description} />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center bg-black">
        <div
          className="w-full"
          style={{
            maxWidth: '1312px',
            minWidth: '1200px',
            padding: '50px 64px 80px',
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="font-orbitron transition-all duration-200 flex items-center gap-2 hover:opacity-80"
            style={{ 
              fontSize: '14px',
              background: '#00FF99',
              color: '#000000',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              marginBottom: '32px',
            }}
          >
            ← Back to Markets
          </button>

          {/* Market Header */}
          <div className="flex items-start gap-6" style={{ marginBottom: '40px' }}>
            {/* Content Section */}
            <div className="flex-1 min-w-0">
              {/* Market Title */}
              <h1 
                className="font-orbitron font-bold text-white" 
                style={{ 
                  fontSize: '36px', 
                  lineHeight: '1.3',
                }}
              >
                {market.title}
              </h1>
            </div>

            {/* Category Icon, Badge, and Deadline - Right Side */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <div 
                className="flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(0, 255, 153, 0.1)',
                  borderRadius: '12px',
                  border: '2px solid rgba(0, 255, 153, 0.3)',
                }}
              >
                <Image src={market.icon} alt={market.category} width={48} height={48} className="rounded" />
              </div>
              <span 
                className="font-orbitron font-bold uppercase"
                style={{
                  background: '#00FF99',
                  color: '#000000',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                {market.category}
              </span>
              <div
                style={{
                  height: '32px',
                  borderRadius: '16px',
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  className="font-orbitron"
                  style={{
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⏱ {getClosingText(market.ends)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar - Horizontal Compact */}
          <div 
            className="grid grid-cols-4 mb-10"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #2A2A2A',
              gap: '32px',
            }}
          >
            <div className="text-center border-r border-[#2A2A2A] last:border-r-0">
              <div className="font-orbitron text-[#888888] text-[11px] uppercase tracking-wider mb-2">Volume</div>
              <div className="font-orbitron text-white text-[24px] font-bold">{market.volume}</div>
              <div className="font-orbitron text-[#00FF99] text-[12px] mt-1">HBAR</div>
            </div>
            <div className="text-center border-r border-[#2A2A2A] last:border-r-0">
              <div className="font-orbitron text-[#888888] text-[11px] uppercase tracking-wider mb-2">Trades</div>
              <div className="font-orbitron text-white text-[24px] font-bold">{market.trades}</div>
              <div className="font-orbitron text-[#666666] text-[12px] mt-1">Total</div>
            </div>
            <div className="text-center border-r border-[#2A2A2A] last:border-r-0">
              <div className="font-orbitron text-[#888888] text-[11px] uppercase tracking-wider mb-2">Traders</div>
              <div className="font-orbitron text-white text-[24px] font-bold">{market.users}</div>
              <div className="font-orbitron text-[#666666] text-[12px] mt-1">Participants</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron text-[#888888] text-[11px] uppercase tracking-wider mb-2">Ends</div>
              <div className="font-orbitron text-white text-[18px] font-bold">{market.ends}</div>
              <div className="font-orbitron text-[#666666] text-[12px] mt-1">Resolution</div>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* Left: Market Probability */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
                borderRadius: '8px',
                padding: '32px',
                border: '1px solid #2A2A2A',
              }}
            >
              <h2 className="font-orbitron font-bold text-[22px] text-white mb-6">Market Probability</h2>
              
              {/* YES and NO Cards */}
              <div className="grid grid-cols-2 gap-5 mb-6">
                <div
                  className="transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(0, 255, 153, 0.1)',
                    border: '2px solid #00FF99',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-[28px]">👍</span>
                  </div>
                  <div className="font-orbitron text-[#00FF99] text-[14px] font-bold uppercase tracking-wider mb-2">YES</div>
                  <div className="font-orbitron text-white text-[52px] font-bold leading-none mb-2">{probability.yes}%</div>
                  <div className="font-orbitron text-[#888888] text-[11px]">
                    {typeof market.yesShares === 'bigint' 
                      ? formatEther(market.yesShares) 
                      : market.yesShares} shares
                  </div>
                </div>
                <div
                  className="transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 51, 102, 0.1)',
                    border: '2px solid #FF3366',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-[28px]">👎</span>
                  </div>
                  <div className="font-orbitron text-[#FF3366] text-[14px] font-bold uppercase tracking-wider mb-2">NO</div>
                  <div className="font-orbitron text-white text-[52px] font-bold leading-none mb-2">{probability.no}%</div>
                  <div className="font-orbitron text-[#888888] text-[11px]">
                    {typeof market.noShares === 'bigint' 
                      ? formatEther(market.noShares) 
                      : market.noShares} shares
                  </div>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="relative h-5 rounded-full overflow-hidden" style={{ background: '#0D0D0D', border: '1px solid #2A2A2A' }}>
                <div
                  className="absolute h-full transition-all duration-500"
                  style={{
                    width: `${probability.yes}%`,
                    background: 'linear-gradient(90deg, #00FF99 0%, #00CC7A 100%)',
                    boxShadow: '0 0 15px rgba(0, 255, 153, 0.4)',
                  }}
                />
              </div>
            </div>

            {/* Right: Buy Shares */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
                borderRadius: '8px',
                padding: '32px',
                border: '1px solid #2A2A2A',
              }}
            >
              <h2 className="font-orbitron font-bold text-[22px] text-white mb-6">Buy Shares</h2>

              {/* Select Outcome */}
              <div className="mb-6">
                <label className="font-orbitron text-[#00FF99] text-[12px] uppercase tracking-wider mb-3 block font-bold">
                  Choose Your Position
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedOutcome(Outcome.Yes)}
                    className="font-orbitron py-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: selectedOutcome === Outcome.Yes ? 'rgba(0, 255, 153, 0.2)' : 'transparent',
                      border: `2px solid ${selectedOutcome === Outcome.Yes ? '#00FF99' : '#333333'}`,
                      color: selectedOutcome === Outcome.Yes ? '#00FF99' : '#888888',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[24px]">👍</span>
                      <span>YES</span>
                      <span className="text-[11px] opacity-70">{probability.yes}%</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOutcome(Outcome.No)}
                    className="font-orbitron py-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: selectedOutcome === Outcome.No ? 'rgba(255, 51, 102, 0.2)' : 'transparent',
                      border: `2px solid ${selectedOutcome === Outcome.No ? '#FF3366' : '#333333'}`,
                      color: selectedOutcome === Outcome.No ? '#FF3366' : '#888888',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[24px]">👎</span>
                      <span>NO</span>
                      <span className="text-[11px] opacity-70">{probability.no}%</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="font-orbitron text-[#00FF99] text-[13px] uppercase tracking-wider mb-4 block font-bold">
                  Amount (ETH)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.001"
                    min="0"
                    className="font-orbitron w-full rounded-lg font-bold transition-all duration-200 focus:outline-none"
                    style={{
                      background: '#000000',
                      border: '2px solid #2A2A2A',
                      padding: '24px 80px 24px 24px',
                      fontSize: '28px',
                      height: '80px',
                      cursor: 'text',
                      color: '#FFFFFF',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #00FF99';
                      e.target.style.boxShadow = '0 0 20px rgba(0, 255, 153, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '2px solid #2A2A2A';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <span 
                    className="font-orbitron absolute right-6 top-1/2 -translate-y-1/2 text-[#888888] font-bold pointer-events-none"
                    style={{
                      fontSize: '16px'
                    }}
                  >
                    ETH
                  </span>
                </div>
                <div className="mt-2 text-[#666666] font-orbitron text-[11px]">
                  Minimum: 0.01 ETH
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuy}
                disabled={!tradeAmount || !isBlockchainMarket || isBuying}
                className="font-orbitron w-full py-5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  background: !tradeAmount || !isBlockchainMarket || isBuying 
                    ? '#333333' 
                    : selectedOutcome === Outcome.Yes ? '#00FF99' : '#FF3366',
                  color: !tradeAmount || !isBlockchainMarket || isBuying
                    ? '#666666'
                    : selectedOutcome === Outcome.Yes ? '#000000' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '16px',
                  border: 'none',
                  boxShadow: !tradeAmount || !isBlockchainMarket || isBuying 
                    ? 'none' 
                    : selectedOutcome === Outcome.Yes 
                      ? '0 4px 20px rgba(0, 255, 153, 0.3)' 
                      : '0 4px 20px rgba(255, 51, 102, 0.3)',
                }}
              >
                {!isBlockchainMarket 
                  ? '🚫 Mock Market - Trading Disabled'
                  : isBuying 
                    ? '⏳ Processing Transaction...' 
                    : `${selectedOutcome === Outcome.Yes ? '📈' : '📉'} Buy ${selectedOutcome === Outcome.Yes ? 'YES' : 'NO'} Shares`
                }
              </button>

              {/* Fee Info */}
              <div
                className="mt-4 p-3 rounded-lg"
                style={{
                  background: 'rgba(0, 255, 153, 0.05)',
                  border: '1px solid rgba(0, 255, 153, 0.2)',
                }}
              >
                <p className="font-orbitron text-[11px] text-[#00FF99] leading-relaxed">
                  💡 Trading fee: 0.5% (0.1% platform, 0.4% to LPs)
                </p>
              </div>
            </div>
          </div>

          {/* LP Token Management Section */}
          {isBlockchainMarket && marketAddress && (
            <div className="mb-10">
              <LPManager
                marketAddress={marketAddress}
                marketState={marketData?.state || MarketState.Active}
              />
            </div>
          )}

          {/* About This Market */}
          <div
            className="mb-10"
            style={{
              background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
              borderRadius: '8px',
              padding: '32px',
              border: '1px solid #2A2A2A',
            }}
          >
            <h2 className="font-orbitron font-bold text-[22px] text-white mb-6">About This Market</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-orbitron text-[#00FF99] text-[12px] uppercase tracking-wider mb-3 font-bold">Description</h3>
                <p className="font-orbitron text-[#CCCCCC] text-[15px] leading-relaxed">
                  {market.description}
                </p>
              </div>

              {isBlockchainMarket && market.address && (
                <div 
                  className="pt-6"
                  style={{ borderTop: '1px solid #2A2A2A' }}
                >
                  <h3 className="font-orbitron text-[#00FF99] text-[12px] uppercase tracking-wider mb-3 font-bold">Contract Address</h3>
                  <div 
                    className="p-4 rounded-lg font-mono text-[12px] break-all"
                    style={{
                      background: '#000000',
                      border: '1px solid #2A2A2A',
                      color: '#888888',
                    }}
                  >
                    {market.address}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Trades */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
              borderRadius: '8px',
              padding: '32px',
              border: '1px solid #2A2A2A',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron font-bold text-[22px] text-white">Recent Trades</h2>
            </div>
            
            {/* Trade List */}
            {isLoadingTrades ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF99] mx-auto mb-4"></div>
                <div className="text-[#888888] font-orbitron text-sm">Loading trades...</div>
              </div>
            ) : !isBlockchainMarket || trades.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#666666] font-orbitron text-sm mb-2">📭</div>
                <div className="text-[#888888] font-orbitron text-sm">
                  {isBlockchainMarket ? 'No trades yet. Be the first!' : 'Trade data only available for blockchain markets'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {trades.map((trade, index) => {
                  const isYes = trade.outcome === Outcome.Yes;
                  const isBuy = trade.type === 'buy';
                  const timeAgo = formatTimeAgo(trade.timestamp);
                  const shortAddress = `${trade.trader.slice(0, 6)}...${trade.trader.slice(-4)}`;
                  
                  return (
                    <div 
                      key={`${trade.txHash}-${index}`}
                      className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: `1px solid ${isYes ? 'rgba(0, 255, 153, 0.15)' : 'rgba(255, 51, 102, 0.15)'}`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-orbitron text-[14px] font-bold" style={{ color: isYes ? '#00FF99' : '#FF3366' }}>
                            {isYes ? '👍' : '👎'} {isYes ? 'YES' : 'NO'}
                          </span>
                          <span className="font-orbitron text-[11px] px-2 py-0.5 rounded" style={{ 
                            background: isBuy ? 'rgba(0, 255, 153, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                            color: isBuy ? '#00FF99' : '#FFA500',
                          }}>
                            {isBuy ? 'BUY' : 'SELL'}
                          </span>
                        </div>
                        <div className="font-orbitron text-white text-[15px] font-bold">
                          {parseFloat(trade.amount).toFixed(4)} ETH
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-orbitron text-[#888888] text-[11px]">{shortAddress}</div>
                        <div className="font-orbitron text-[#666666] text-[10px] mt-0.5">{timeAgo}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketDetail;

