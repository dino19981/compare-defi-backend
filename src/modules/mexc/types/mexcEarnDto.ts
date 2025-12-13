export interface MexcEarnItem {
  currency: string;
  currencyId: string;
  financialProductList: MexcEarnProduct[];
  hasAprRange: boolean;
}

export interface MexcEarnsDto {
  code: number;
  data: MexcEarnItem[];
  message: string;
}

export interface MexcEarnProduct {
  financialId: string;
  financialType: string;
  investPeriodType: string;
  /** duration is days. null if duration is infinity */
  fixedInvestPeriodCount: number | null;
  /** USDT */
  currency: string;
  /** '4.5' */
  baseApr: string;
  showApr: string;
  soldOut: boolean;
  /** Есть ли rateSettings */
  subsidyTieredFlag: boolean;
  tieredSubsidyApr?: {
    /** '0' */
    startQuantity: string;
    /** '300' */
    endQuantity: string;
    /**'12' */
    apr: string;
  }[];
}
