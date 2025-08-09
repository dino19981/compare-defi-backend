export type AvailableTokens =
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

// @доделать: Добавить суи в coinNameByCoinNumber
// Добавь новый токен в coinNameByCoinNumber
export const AVAILABLE_TOKENS = [
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

export const isAvailableTokenForEarnings = (token: string) => {
  return (
    AVAILABLE_TOKENS.find((t) => t.toUpperCase() === token.toUpperCase()) !==
    undefined
  );
};
