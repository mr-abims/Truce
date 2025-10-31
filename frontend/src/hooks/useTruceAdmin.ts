import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { type Address } from 'viem';
import { TRUCE_FACTORY_ADDRESS } from '../config/contracts';
import { TruceFactoryABI } from '../config/abis';

// Get factory owner
export function useGetFactoryOwner() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'owner',
  });

  return {
    owner: data as Address | undefined,
    isError,
    isLoading,
    refetch,
  };
}

// Get total platform fees
export function useGetPlatformFees() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'totalPlatformFees',
  });

  return {
    totalFees: data as bigint | undefined,
    isError,
    isLoading,
    refetch,
  };
}

// Get pending disputes
export function useGetPendingDisputes() {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'getPendingDisputes',
  });

  return {
    disputes: data as Address[] | undefined,
    isError,
    isLoading,
    refetch,
  };
}

// Get creator reputation
export function useGetCreatorReputation(creatorAddress?: Address) {
  const { data, isError, isLoading, refetch } = useReadContract({
    address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
    abi: TruceFactoryABI,
    functionName: 'getCreatorReputation',
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: !!creatorAddress,
    },
  });

  return {
    reputation: data as [bigint, bigint, bigint] | undefined, // [marketsCreated, disputesLost, reputationScore]
    isError,
    isLoading,
    refetch,
  };
}

// Withdraw platform fees
export function useWithdrawFees() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdrawFees = async () => {
    return writeContract({
      address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
      abi: TruceFactoryABI,
      functionName: 'withdrawFees',
    });
  };

  return {
    withdrawFees,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

// Resolve market dispute
export function useResolveDispute() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const resolveDispute = async (marketAddress: Address, disputeValid: boolean) => {
    return writeContract({
      address: TRUCE_FACTORY_ADDRESS[sepolia.id] as Address,
      abi: TruceFactoryABI,
      functionName: 'resolveMarketDispute',
      args: [marketAddress, disputeValid],
    });
  };

  return {
    resolveDispute,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

