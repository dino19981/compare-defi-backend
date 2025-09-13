import { LendingPlatformName } from './LendingPlatformName';

export interface Lending {
  id: string;

  token: LendingToken;
  chain: LendingChain;
  platform: LendingPlatform;

  totalSupplied: number;
  supplyAPY: number;

  totalBorrowed: number;
  borrowAPY: number;

  badges?: string[];
}

export interface LendingToken {
  name: string;
  imageUrl: string;
}

export interface LendingPlatform {
  name: LendingPlatformName;
  link: string;
  refLink?: string;
}

export interface LendingChain {
  name: string;
  imageUrl: string;
}
