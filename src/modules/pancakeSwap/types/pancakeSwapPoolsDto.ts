export interface PancakeSwapPoolsDto {
  rows: PancakeSwapPoolDto[];
}

// - это фарминг и пулы ликвидности
export interface PancakeSwapPoolDto {
  token0: {
    id: string;
    symbol: string;
  };
  token1: {
    id: string;
    symbol: string;
  };
  id: string;
  chainId: number;
  protocol: string;
  tvlUSD: string;
  volumeUSD24h: string;
  apr24h: string;
  feeTier: number;
}
