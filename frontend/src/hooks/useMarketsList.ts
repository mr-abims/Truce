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
        if (result.status !== 'success' || !result.result) return null;
        
        const data = result.result as any;
        const address = marketAddresses[index];

        return {
          address,
          question: data.question,
          category: Number(data.category || 0),
          totalYesShares: data.totalYesShares,
          totalNoShares: data.totalNoShares,
          resolutionDeadline: Number(data.resolutionDeadline),
          state: data.state,
          tradeCount: Number(data.tradeCount),
          createdAt: Number(data.createdAt),
          creator: data.creator,
        } as MarketInfo;
      })
      .filter((m): m is MarketInfo => m !== null);

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
export function getCategoryName(categoryEnum: number): string {
  const categories = ['Crypto', 'Sports', 'Politics', 'Weather', 'Entertainment', 'Other'];
  return categories[categoryEnum] || 'Other';
}

// Helper to get category icon
export function getCategoryIcon(categoryEnum: number): string {
  const categoryName = getCategoryName(categoryEnum);
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

