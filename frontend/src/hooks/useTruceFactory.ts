import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther, type Address } from 'viem';
import { TRUCE_FACTORY_ADDRESS, CATEGORY_MAP, type MarketCategory } from '../config/contracts';
import { TruceFactoryABI } from '../config/abis';

export function useCreateMarket() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createMarket = async (
    question: string,
    resolutionDeadline: number, // Unix timestamp in seconds
    initialLiquidityEth: string, // Amount in ETH as string
    categoryId: string // Frontend category ID (e.g., 'crypto', 'sports')
  ) => {
    const category = CATEGORY_MAP[categoryId.toLowerCase()];
    if (category === undefined) {
      throw new Error(`Invalid category: ${categoryId}`);
    }

    const liquidityWei = parseEther(initialLiquidityEth);

    return writeContract({
      address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
      abi: TruceFactoryABI,
      functionName: 'createMarket',
      args: [question, BigInt(resolutionDeadline), liquidityWei, category],
      value: liquidityWei,
    });
  };

  return {
    createMarket,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useGetAllMarkets() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'getAllMarkets',
  });

  return {
    markets: data as Address[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

export function useGetMarketsByCategory(category: MarketCategory) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'getMarketsByCategory',
    args: [category],
  });

  return {
    markets: data as Address[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

export function useGetMarketsByCreator(creatorAddress?: Address) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'getMarketsByCreator',
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: !!creatorAddress,
    },
  });

  return {
    markets: data as Address[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

export function useGetMarketCount() {
  const { data, isError, isLoading } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'getMarketCount',
  });

  return {
    count: data ? Number(data) : 0,
    isError,
    isLoading,
  };
}

