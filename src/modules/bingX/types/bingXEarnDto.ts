export interface BingXEarnsDto {
  data: {
    result: BingXEarnDto[];
  };
}

export interface BingXEarnDto {
  assetName: string;
  icon: string;
  minApy: string;
  maxApy: string;
  products: BingxEarnProduct[];
}

export interface BingxEarnProduct {
  productId: number;
  productType: 1 | 2 | 3;
  duration: number;
  apy: string;
  productName: string;
  tags: {
    // 2 - новый пользователь
    // 1 - vip пользователь
    tagId: number;
    tagType: number;
  }[];
  tieredApyRule?: {
    rules: {
      low: string;
      high: string;
      apy: string;
      level: number;
    }[];
  };
}
