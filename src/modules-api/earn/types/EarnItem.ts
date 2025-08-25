export type InfinityValue = 'Infinity';
export const infinityValue: InfinityValue = 'Infinity';

export interface EarnItem {
  id: string;

  // @посмотреть: нужны ли эти поля?
  name?: string;
  periodType: 'flexible' | 'fixed';

  token: EarnItemToken;
  platform: EarnItemPlatform;

  // @посмотреть: нужно ли это поле? оно такое же как и badges
  productLevel: EarnItemLevel;

  // Новые поля
  maxRate: number;
  rateSettings?: EarnItemRateSettings[];
  duration: number | InfinityValue;

  badges?: EarnItemBadge[];
}

export enum EarnItemLevel {
  NewUser = 'newUser',
  Beginner = 'beginner',
  Normal = 'normal',
  VIP = 'vip',
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
  refLink?: string;
}

export interface EarnItemRateSettings {
  min: number;
  max: number | InfinityValue;
  apy: number;
}

export enum EarnItemBadge {
  SmallLimit = 'smallLimit',
  ForNewUsers = 'forNewUsers',
}
