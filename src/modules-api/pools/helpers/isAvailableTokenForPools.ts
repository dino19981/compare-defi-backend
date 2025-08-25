export type AvailableTokensForPools =
  | 'USDT'
  | 'USDC'
  | 'suiUSDT'
  | 'suiWBTC'
  | 'LBTC'
  | 'ETH'
  | 'WETH'
  | 'BTC'
  | 'USDE'
  | 'SOL'
  | 'wUSDT'
  | 'wUSDC'
  | 'WBTC'
  | 'SUI'
  | 'vSUI'
  | 'stSUI'
  | 'haSUI';

export const AVAILABLE_TOKENS_FOR_POOLS = [
  'USDT',
  'suiUSDT',
  'wUSDT',

  'USDC',
  'wUSDC',

  'ETH',
  'WETH',
  'suiETH',

  'BTC',
  'suiWBTC',
  'WBTC',
  'LBTC',

  'USDE',

  'SOL',

  'SUI',
  'vSUI',
  'stSUI',
  'haSUI',
] as const;

export const isAvailableTokenForPools = (token: string) => {
  return (
    AVAILABLE_TOKENS_FOR_POOLS.find(
      (t) => t.toUpperCase() === token.toUpperCase(),
    ) !== undefined
  );
};
