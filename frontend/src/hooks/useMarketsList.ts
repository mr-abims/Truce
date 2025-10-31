import { useEffect, useState } from 'react';
import { type Address, formatEther } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import { useGetAllMarkets } from './useTruceFactory';
import { TruceMarketABI } from '../config/abis';
import { MarketState } from '../config/contracts';

export interface MarketInfo {
  address: Address;
  question: string;
  category: number;
  totalYesShares: bigint;
  totalNoShares: bigint;
  resolutionDeadline: number;
  state: MarketState;
  tradeCount: number;
  createdAt: number;
  creator: Address;
}

// Hook to fetch data for a single market
export function useMarketInfo(marketAddress?: Address) {
  const { data, isError, isLoading } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'getMarketData',
    query: {
      enabled: !!marketAddress,
    },
  });

  if (!data || !marketAddress) return null;

  const marketData = data as any;

  return {
    address: marketAddress,
    question: marketData.question,
    category: Number(marketData.category || 0),
    totalYesShares: marketData.totalYesShares,
    totalNoShares: marketData.totalNoShares,
    resolutionDeadline: Number(marketData.resolutionDeadline),
    state: marketData.state,
    tradeCount: Number(marketData.tradeCount),
    createdAt: Number(marketData.createdAt),
    creator: marketData.creator,
  } as MarketInfo;
}

// Hook to fetch all markets with their data
export function useAllMarketsData() {
  const { markets: marketAddresses, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useGetAllMarkets();
  const [marketsData, setMarketsData] = useState<MarketInfo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Create contracts array for batch fetching
  const contracts = marketAddresses?.map((address) => ({
    address,
    abi: TruceMarketABI,
    functionName: 'getMarketData' as const,
  })) || [];

  const { data: marketsRawData, isLoading: isFetchingData, refetch: refetchData } = useReadContracts({
    contracts,
    query: {
      enabled: !!marketAddresses && marketAddresses.length > 0,
    },
  });

  useEffect(() => {
    if (!marketsRawData || !marketAddresses) {
      setMarketsData([]);
      return;
    }

    setIsLoadingData(true);
    
    const processed = marketsRawData
      .map((result, index) => {
        if (result.status !== 'success' || !result.result) {
          console.log('Market data fetch failed:', { index, status: result.status });
          return null;
        }
        
        const data = result.result as any;
        const address = marketAddresses[index];
        
        // Debug logging for category data - let's see the full raw data structure
        console.log('RAW MARKET DATA:', { 
          address, 
          fullData: data,
          isArray: Array.isArray(data),
          dataKeys: Object.keys(data || {}),
          dataLength: Array.isArray(data) ? data.length : 'not array'
        });
        
        // If it's an array, log each index
        if (Array.isArray(data)) {
          console.log('Data by index:', {
            0: data[0], // question
            1: data[1], // creator
            2: data[2], // factory
            3: data[3], // createdAt
            4: data[4], // resolutionDeadline
            5: data[5], // state
            6: data[6], // result
            7: data[7], // totalYesShares
            8: data[8], // totalNoShares
            9: data[9], // k
            10: data[10], // tradeCount
            11: data[11], // capConfig (nested)
            12: data[12], // category (should be here!)
            13: data[13], // accumulatedFees
          });
        }

        // Try both array access and property access for category
        const categoryValue = Array.isArray(data) ? data[12] : data.category;
        const question = data.question || data[0];
        
        // Parse category - handle invalid values (like 3600) by inferring from question
        let parsedCategory = Number(categoryValue || 0);
        
        // If category is out of range (should be 0-5), infer from question
        if (parsedCategory < 0 || parsedCategory > 5) {
          const inferredCategory = inferCategoryFromQuestion(question);
          console.warn(`Invalid category value ${parsedCategory} for market "${question}". Inferring from question: ${inferredCategory}`);
          parsedCategory = inferredCategory;
        }
        
        console.log('Category extraction:', {
          question,
          propertyAccess: data.category,
          arrayAccess: Array.isArray(data) ? data[12] : 'not array',
          rawValue: categoryValue,
          parsedValue: parsedCategory
        });

        // Extract and convert state properly
        const stateValue = data.state !== undefined ? data.state : data[5];
        const parsedState = typeof stateValue === 'bigint' ? Number(stateValue) : 
                           typeof stateValue === 'number' ? stateValue : 
                           Number(stateValue || 0);

        console.log('State extraction:', {
          question,
          propertyAccess: data.state,
          arrayAccess: Array.isArray(data) ? data[5] : 'not array',
          rawValue: stateValue,
          rawType: typeof stateValue,
          parsedValue: parsedState,
          parsedType: typeof parsedState
        });

        return {
          address,
          question,
          category: parsedCategory,
          totalYesShares: data.totalYesShares || data[7],
          totalNoShares: data.totalNoShares || data[8],
          resolutionDeadline: Number(data.resolutionDeadline || data[4]),
          state: parsedState,
          tradeCount: Number(data.tradeCount || data[10]),
          createdAt: Number(data.createdAt || data[3]),
          creator: data.creator || data[1],
        } as MarketInfo;
      })
      .filter((m): m is MarketInfo => m !== null);

    console.log('All processed markets:', processed.map(m => ({ 
      question: m.question, 
      category: m.category 
    })));

    setMarketsData(processed);
    setIsLoadingData(false);
  }, [marketsRawData, marketAddresses]);

  return {
    markets: marketsData,
    isLoading: isLoadingAddresses || isFetchingData || isLoadingData,
    totalCount: marketAddresses?.length || 0,
    refetch: () => {
      refetchAddresses();
      refetchData();
    },
  };
}

// Helper function to calculate market volume
export function calculateMarketVolume(market: MarketInfo): string {
  const total = market.totalYesShares + market.totalNoShares;
  return formatEther(total);
}

// Helper function to check if market is active
export function isMarketActive(market: MarketInfo): boolean {
  const now = Math.floor(Date.now() / 1000);
  return market.state === MarketState.Active && market.resolutionDeadline > now;
}

// Helper function to check if market is closed
export function isMarketClosed(market: MarketInfo): boolean {
  const now = Math.floor(Date.now() / 1000);
  return market.state === MarketState.Resolved || 
         market.state === MarketState.Cancelled || 
         (market.state === MarketState.Active && market.resolutionDeadline < now);
}

// Helper function to get time until deadline
export function getTimeUntilDeadline(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;

  if (diff < 0) return 'Ended';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Less than 1 hour';
}

// Helper function to format date
export function formatMarketDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper to format category enum to display name
// Helper to infer category from question text (for markets with invalid category stored)
function inferCategoryFromQuestion(question: string): number {
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
}

export function getCategoryName(categoryEnum: number, question?: string): string {
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
}

// Helper to get category icon
export function getCategoryIcon(categoryEnum: number, question?: string): string {
  const categoryName = getCategoryName(categoryEnum, question);
  const icons: Record<string, string> = {
    'Crypto': '/images/crypto.png',
    'Sports': '/images/sports.png',
    'Politics': '/images/politics.png',
    'Weather': '/images/weath.png',
    'Entertainment': '/images/opera.png',
    'Other': '/images/idea.png',
  };
  return icons[categoryName] || '/images/idea.png';
}

