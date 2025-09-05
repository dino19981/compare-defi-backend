interface RaydiumCoin {
  chainId: number;
  logoURI: string;
  symbol: string;
}

interface RaydiumStats {
  volume: number;
  volumeQuote: number;
  volumeFee: number;
  apr: number;
}

export interface RaydiumPool {
  mintA: RaydiumCoin;
  mintB: RaydiumCoin;
  feeRate: number;
  tvl: number;
  day: RaydiumStats;
  week: RaydiumStats;
  month: RaydiumStats;
}

export interface RaydiumPoolsResponse {
  data: {
    data: RaydiumPool[];
  };
}
