import { sepolia } from 'wagmi/chains';

export const TRUCE_FACTORY_ADDRESS = {
  [sepolia.id]: '0xC28779CC060C9959CC1728c3210D8d793bF6eff9' as `0x${string}`,
} as const;

// Market categories enum (must match Solidity)
export enum MarketCategory {
  CRYPTO = 0,
  SPORTS = 1,
  POLITICS = 2,
  WEATHER = 3,
  ENTERTAINMENT = 4,
  OTHER = 5,
}

// Map frontend category IDs to enum values
export const CATEGORY_MAP: Record<string, MarketCategory> = {
  crypto: MarketCategory.CRYPTO,
  sports: MarketCategory.SPORTS,
  politics: MarketCategory.POLITICS,
  weather: MarketCategory.WEATHER,
  entertainment: MarketCategory.ENTERTAINMENT,
  other: MarketCategory.OTHER,
};

// Outcome enum (must match Solidity)
export enum Outcome {
  Yes = 0,
  No = 1,
}

// Market state enum (must match Solidity)
export enum MarketState {
  Active = 0,
  PendingDispute = 1,
  Disputed = 2,
  Resolved = 3,
  Cancelled = 4,
}

