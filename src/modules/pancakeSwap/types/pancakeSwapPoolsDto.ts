export interface PancakeSwapPoolsDto {
  data: PancakeSwapPoolDto[];
}

export interface PancakeSwapPoolDto {
  pool: {
    token0: {
      symbol: string;
    };
    token1: {
      symbol: string;
    };
    fee: number;
  };
  id: string;
  chainId: number;
  protocol: string;
  tvlUSD: string;
  vol24hUsd: string;
  pid: number;
  apr24h: number;
  feeTier: number;
}
