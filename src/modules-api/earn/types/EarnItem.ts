export interface EarnItem {
  id: string;
  name?: string;
  token: EarnItemToken;
  periodType: 'flexible' | 'fixed';
  platform: EarnItemPlatform;
  rates: EarnItemRate[];
  productLevel: EarnItemLevel;
}

export enum EarnItemLevel {
  Beginner = 'beginner',
  Normal = 'normal',
  VIP = 'VIP',
}

export interface EarnItemRate {
  rateLevel: number;
  currentApy: number;
}

export interface EarnItemToken {
  name: string;
}

export interface EarnItemRate {
  rateLevel: number;
  currentApy: number;
}

export interface EarnItemPlatform {
  name: string;
  link: string;
}
