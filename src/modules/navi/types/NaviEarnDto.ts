export interface NaviEarnDto {
  data: NaviEarnItemDto[];
}

export interface NaviEarnItemDto {
  token: {
    symbol: string;
  };
  supplyIncentiveApyInfo: {
    vaultApr: string;
    apy: string;
  };
}
