interface BitgetEarnApyDto {
  rateLevel: string;
  minStepVal: string;
  maxStepVal: string;
  currentApy: string;
}

enum BitgetEarnStatusDto {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Paused = 'paused',
  Completed = 'completed',
  SoldOut = 'sold_out',
}

enum BitgetEarnUserLevelDto {
  Beginner = 'beginner',
  Normal = 'normal',
  VIP = 'VIP',
}

export interface BitgetEarnDto {
  productId: string;
  coin: string;
  periodType: 'flexible' | 'fixed';
  /**
   * Если periodType = 'flexible' то period = ''
   * Число в виде строки
   */
  period: string;
  apyType: 'ladder' | 'single';
  advanceRedeem: 'Yes' | 'No' | '';
  settleMethod: 'daily' | 'maturity' | '';
  apyList: BitgetEarnApyDto[];
  status: BitgetEarnStatusDto;
  productLevel: BitgetEarnUserLevelDto;
}

export interface BitgetEarnsDto {
  code: string;
  msg: 'success' | 'error';
  requestTime: number;

  data: BitgetEarnDto[];
}
