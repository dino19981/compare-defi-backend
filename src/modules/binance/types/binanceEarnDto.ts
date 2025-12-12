export interface BinanceEarnsDto {
  data: {
    list: BinanceEarnDto[];
  };
}

export interface BinanceEarnDto {
  asset: string;
  productDetailList: BinanceProductSummary[];
}

interface BinanceProductSummary {
  productType: BinanceProductSummaryType;
  // number
  apy: string;
  // // number
  // minApr: string;
  productId: string;
  duration: string;
}

export enum BinanceProductSummaryType {
  SimpleEarn = 'SIMPLE_EARN',
  DualCurrency = 'DUAL_CURRENCY',
}
