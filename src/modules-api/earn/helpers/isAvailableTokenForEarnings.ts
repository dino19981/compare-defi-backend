export const AVAILABLE_TOKENS = [
  'usdt',
  'usdc',
  'eth',
  'btc',
  'usde',
  'sol',
].map((token) => token.toUpperCase());

export const isAvailableTokenForEarnings = (token: string) =>
  AVAILABLE_TOKENS.includes(token.toUpperCase());
