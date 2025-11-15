import { TokenModel } from '../types';

export const formatToLowerCaseTokenName = (name: string) => {
  return name.toLowerCase().trim();
};

export const findTokenDataByName = (
  name: string,
  tokens: Record<string, TokenModel>,
) => {
  const token = tokens[formatToLowerCaseTokenName(name)];

  if (!token || token.image.includes('missing_')) {
    return null;
  }

  return token;
};
