import { v4 as uuidv4 } from 'uuid';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';

export interface LidoEarnDto {
  name: string;
  apr: number;
  link: string;
}

export const formatLidoEarn = (data: LidoEarnDto[]): EarnItem[] => {
  return data.map((item) => ({
    id: uuidv4(),
    token: {
      name: 'ETH',
    },
    periodType: 'flexible',
    platform: {
      link: item.link,
      name: item.name,
    },
    maxRate: item.apr,
    productLevel: EarnItemLevel.Beginner,
    duration: infinityValue,
  }));
};
