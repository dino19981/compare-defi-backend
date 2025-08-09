export interface VenusEarnDto {
  result: VenusEarnItemDto[];
}

export interface VenusEarnItemDto {
  markets: {
    supplyApy: string;
    underlyingSymbol: string;
  }[];
}
