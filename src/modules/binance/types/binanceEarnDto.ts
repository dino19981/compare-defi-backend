export interface BinanceEarnsDto {
  data: {
    list: BinanceEarnDto[];
  };
}

export interface BinanceEarnDto {
  asset: string;
  productSummary: BinanceProductSummary[];
}

interface BinanceProductSummary {
  productType: BinanceProductSummaryType;
  // number
  maxApr: string;
  // number
  minApr: string;
  productId: string;
  duration: string[];
}

export enum BinanceProductSummaryType {
  SimpleEarn = 'SIMPLE_EARN',
  DualCurrency = 'DUAL_CURRENCY',
}
