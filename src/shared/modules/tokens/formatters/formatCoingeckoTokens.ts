import { CoinGeckoTokenDto, TokenModel } from '../types';

export const formatCoingeckoTokens = (
  tokens: CoinGeckoTokenDto[],
): TokenModel[] => {
  return tokens.map((token) => ({
    id: token.id,
    symbol: token.symbol,
    name: token.name,
    image: token.image,
  }));
};
