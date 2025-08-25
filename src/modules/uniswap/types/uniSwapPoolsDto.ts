export interface UniSwapPoolsDto {
  stats: {
    poolStats: UniSwapPoolDto[];
  };
}

export interface UniSwapPoolDto {
  id: string;
  chain: string;
  totalLiquidity: {
    value: number;
  };
  txCount: number;
  volume1Day: {
    value: number;
  };
  feeTier: number;
  token0: Token;
  token1: Token;
  protocolVersion: 'V4' | 'V3' | 'V2';
  boostedApr: number;
}

interface Token {
  chain: string;
  address: string;
  name: string;
  symbol: string;
  logo: string;
}
