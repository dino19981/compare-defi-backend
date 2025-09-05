export interface CetusCoin {
  coinType: string;
  symbol: string;
  decimals: number;
  isVerified: boolean;
  logoURL: string;
}

export interface CetusStats {
  dateType: string;
  vol: string;
  fee: string;
  apr: string;
}

export interface CetusMiningRewarder {
  coinType: string;
  symbol: string;
  decimals: number;
  logoURL: string;
  display: boolean;
  apr: string;
  emissionsPerSecond: string;
}

export interface CetusPool {
  pool: string;
  feeRate: number;
  showReverse: boolean;
  coinA: CetusCoin;
  coinB: CetusCoin;
  tvl: string;
  totalApr: string;
  stats: CetusStats[];
  miningRewarders: CetusMiningRewarder[];
}

export interface CetusPoolsResponse {
  data: {
    list: CetusPool[];
  };
}
