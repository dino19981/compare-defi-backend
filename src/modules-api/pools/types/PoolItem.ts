import { PoolPlatform } from './PoolPlatform';

export interface PoolItem {
  id: string;

  firstToken: PoolItemToken;
  secondToken: PoolItemToken;

  chain: PoolItemChain;

  platform: PoolItemPlatform;

  tvl: number;
  volume: number;
  fee: number;

  apr: number;

  badges?: PoolItemBadge[];
}

export interface PoolItemToken {
  name: string;
  imageUrl: string;
}

export interface PoolItemPlatform {
  name: PoolPlatform;
  link: string;
  refLink?: string;
}

export enum PoolItemBadge {
  SmallLimit = 'smallLimit',
  ForNewUsers = 'forNewUsers',
}

export interface PoolItemChain {
  name: string;
  imageUrl: string;
}
