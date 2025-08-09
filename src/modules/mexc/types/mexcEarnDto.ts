export interface MexcEarnItem {
  currency: string;
  currencyId: string;
  lockPosList: MexcEarnProduct[];
  holdPosList: MexcEarnProduct[];
}

export interface MexcEarnsDto {
  code: number;
  data: MexcEarnItem[];
  message: string;
}

export interface MexcEarnProduct {
  id: string;
  currency: string;
  currencyId: string;
  minLockDays: number;
  profitRate: number;
  maxStepRate?: number;
  profitRangeStart: null;
  profitRangeEnd: null;
  totalRemain: string;
  memberRemain: string;
  totalLimit: string;
  limitMax: string;
  stakingType: string;
  status: string;
  stepRateList: {
    startLockQuantity: string;
    endLockQuantity: string;
    stepRate: string;
  }[];
}
