import { useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseEther, type Address, formatEther } from 'viem';
import { TruceMarketABI } from '../config/abis';
import { Outcome } from '../config/contracts';
import { useState, useEffect } from 'react';

// Hook to get market data
export function useGetMarketData(marketAddress?: Address) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'getMarketData',
    query: {
      enabled: !!marketAddress,
    },
  });

  return {
    marketData: data,
    isLoading,
    isError,
    refetch,
  };
}

// Hook to get user's shares
export function useGetUserShares(marketAddress?: Address, userAddress?: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'getUserShares',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!marketAddress && !!userAddress,
    },
  });

  const shares = data as [bigint, bigint] | undefined;

  return {
    yesShares: shares?.[0] || BigInt(0),
    noShares: shares?.[1] || BigInt(0),
    isLoading,
    refetch,
  };
}

// Hook to buy shares
export function useBuyShares(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyShares = async (outcome: Outcome, amountEth: string) => {
    if (!marketAddress) return;
    
    const value = parseEther(amountEth);

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'buyShares',
      args: [outcome],
      value,
    });
  };

  return {
    buyShares,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to sell shares
export function useSellShares(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sellShares = async (outcome: Outcome, shares: bigint) => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'sellShares',
      args: [outcome, shares],
    });
  };

  return {
    sellShares,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to add liquidity
export function useAddLiquidity(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addLiquidity = async (amountEth: string) => {
    if (!marketAddress) return;
    
    const value = parseEther(amountEth);

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'addLiquidity',
      value,
    });
  };

  return {
    addLiquidity,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to remove liquidity
export function useRemoveLiquidity(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const removeLiquidity = async (lpAmount: bigint) => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'removeLiquidity',
      args: [lpAmount],
    });
  };

  return {
    removeLiquidity,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to redeem LP tokens (after market resolution)
export function useRedeemLPTokens(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const redeemLPTokens = async () => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'redeemLPTokens',
    });
  };

  return {
    redeemLPTokens,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to transfer LP tokens
export function useTransferLPTokens(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transferLPTokens = async (to: Address, amount: bigint) => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  return {
    transferLPTokens,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to get LP token balance
export function useGetLPTokenBalance(marketAddress?: Address, userAddress?: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!marketAddress && !!userAddress,
    },
  });

  return {
    lpBalance: (data as bigint) || BigInt(0),
    isLoading,
    refetch,
  };
}

// Hook to get accumulated fees
export function useGetAccumulatedFees(marketAddress?: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'accumulatedFees',
    query: {
      enabled: !!marketAddress,
    },
  });

  return {
    accumulatedFees: (data as bigint) || BigInt(0),
    isLoading,
    refetch,
  };
}

// Hook to get total LP supply
export function useGetTotalLPSupply(marketAddress?: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!marketAddress,
    },
  });

  return {
    totalSupply: (data as bigint) || BigInt(0),
    isLoading,
    refetch,
  };
}

// Hook to redeem winnings (after market resolution)
export function useRedeemWinnings(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const redeemWinnings = async () => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'redeemWinnings',
    });
  };

  return {
    redeemWinnings,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to resolve market (creator only)
export function useResolveMarket(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const resolveMarket = async (result: Outcome) => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'resolveMarket',
      args: [result],
    });
  };

  return {
    resolveMarket,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to submit dispute
export function useSubmitDispute(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const submitDispute = async (proposedOutcome: Outcome, reason: string, bondEth: string) => {
    if (!marketAddress) return;
    
    const value = parseEther(bondEth);

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'submitDispute',
      args: [proposedOutcome, reason],
      value,
    });
  };

  return {
    submitDispute,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to finalize resolution (after dispute period)
export function useFinalizeResolution(marketAddress?: Address) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const finalizeResolution = async () => {
    if (!marketAddress) return;

    return writeContract({
      address: marketAddress,
      abi: TruceMarketABI,
      functionName: 'finalizeResolution',
    });
  };

  return {
    finalizeResolution,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Hook to get current cap
export function useGetCurrentCap(marketAddress?: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'getCurrentCap',
    query: {
      enabled: !!marketAddress,
    },
  });

  return {
    currentCap: (data as bigint) || BigInt(0),
    isLoading,
    refetch,
  };
}

// Hook to get disputes
export function useGetDisputes(marketAddress?: Address) {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: TruceMarketABI,
    functionName: 'getDisputes',
    query: {
      enabled: !!marketAddress,
    },
  });

  return {
    disputes: data || [],
    isLoading,
    refetch,
  };
}

// Trade event type
export interface Trade {
  trader: Address;
  outcome: Outcome;
  amount: string;
  shares: string;
  timestamp: number;
  type: 'buy' | 'sell';
  txHash: string;
}

// Hook to get recent trades
export function useGetRecentTrades(marketAddress?: Address, limit: number = 10) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchTrades = async () => {
      if (!marketAddress || !publicClient) {
        setTrades([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get the current block number
        const currentBlock = await publicClient.getBlockNumber();
        
        // Fetch last ~1000 blocks worth of events (adjust as needed)
        const fromBlock = currentBlock - BigInt(1000);

        // Fetch SharesPurchased events
        const purchaseEvents = await publicClient.getContractEvents({
          address: marketAddress,
          abi: TruceMarketABI,
          eventName: 'SharesPurchased',
          fromBlock,
          toBlock: 'latest',
        });

        // Fetch SharesSold events
        const soldEvents = await publicClient.getContractEvents({
          address: marketAddress,
          abi: TruceMarketABI,
          eventName: 'SharesSold',
          fromBlock,
          toBlock: 'latest',
        });

        // Process purchase events
        const purchaseTrades: Trade[] = await Promise.all(
          purchaseEvents.map(async (event: any) => {
            const block = await publicClient.getBlock({ blockNumber: event.blockNumber });
            return {
              trader: event.args.buyer,
              outcome: event.args.outcome,
              amount: formatEther(event.args.cost),
              shares: formatEther(event.args.shares),
              timestamp: Number(block.timestamp),
              type: 'buy' as const,
              txHash: event.transactionHash,
            };
          })
        );

        // Process sold events
        const soldTrades: Trade[] = await Promise.all(
          soldEvents.map(async (event: any) => {
            const block = await publicClient.getBlock({ blockNumber: event.blockNumber });
            return {
              trader: event.args.seller,
              outcome: event.args.outcome,
              amount: formatEther(event.args.payout),
              shares: formatEther(event.args.shares),
              timestamp: Number(block.timestamp),
              type: 'sell' as const,
              txHash: event.transactionHash,
            };
          })
        );

        // Combine and sort by timestamp (most recent first)
        const allTrades = [...purchaseTrades, ...soldTrades]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);

        setTrades(allTrades);
      } catch (error) {
        console.error('Error fetching trades:', error);
        setTrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, [marketAddress, publicClient, limit]);

  return {
    trades,
    isLoading,
  };
}

