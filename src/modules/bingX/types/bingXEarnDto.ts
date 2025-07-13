export interface BingXEarnsDto {
  data: {
    data: BingXEarnDto[];
  };
}

export interface BingXEarnDto {
  productId: string;
  productName: string;
  currency: string;
  apy: string;
  period: string;
  minInvestAmount: string;
  maxInvestAmount: string;
  status: string;
}
