export interface PancakeSwapTokensDto {
  tokens: PancakeSwapTokenDto[];
}

export interface PancakeSwapTokenDto {
  chainId: number;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
}
