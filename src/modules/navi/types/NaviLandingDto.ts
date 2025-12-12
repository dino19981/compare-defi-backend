export interface NaviLandingDto {
  data: NaviLandingItemDto[];
}

export interface NaviLandingItemDto {
  id: string;
  token: {
    symbol: string;
  };
  supplyIncentiveApyInfo: {
    vaultApr: string;
    apy: string;
  };
}
