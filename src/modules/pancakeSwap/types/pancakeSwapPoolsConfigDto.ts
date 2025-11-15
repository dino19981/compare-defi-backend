export interface PancakeSwapPoolConfigDto {
  token0: {
    symbol: string;
    chainId: number;
    address: string;
  };
  token1: {
    symbol: string;
    chainId: number;
    address: string;
  };
  id: string;
  chainId: number;
  protocol: string;
}

export type PancakeSwapPoolTokenConfigs = Record<
  string,
  PancakeSwapPoolConfigDto['token0']
>;
