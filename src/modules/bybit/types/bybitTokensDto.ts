export interface BybitTokensDto {
  result: {
    coins: BybitTokenDto[];
  };
}

export interface BybitTokenDto {
  // [coin_enum, name, хз, хз, image, image, image]
  coin: [string, string, string, string, string, string, string];
}
