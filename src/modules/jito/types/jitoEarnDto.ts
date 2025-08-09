export interface JitoEarnDto {
  getStakePoolStats: {
    apy: JitoAprDto[];
  };
}

export interface JitoAprDto {
  data: number;
}
