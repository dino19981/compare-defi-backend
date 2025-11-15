export interface TokenModel {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export interface TokensDto {
  data: TokenModel[];
}
