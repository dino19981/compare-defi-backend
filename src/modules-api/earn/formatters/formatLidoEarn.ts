import { v4 as uuidv4 } from 'uuid';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

export interface LidoEarnDto {
  name: string;
  apr: number;
  link: string;
}

export const formatLidoEarn = (
  data: LidoEarnDto[],
  tokens: Record<string, TokenModel>,
): EarnItem[] => {
  return data.map((item) => {
    const token = findTokenDataByName('ETH', tokens);

    return {
      id: uuidv4(),
      token: {
        name: 'ETH',
        icon: token?.image,
      },
      periodType: 'flexible',
      platform: {
        link: addAnalyticsToLink(item.link),
        name: item.name,
      },
      maxRate: item.apr,
      productLevel: EarnItemLevel.Beginner,
      duration: infinityValue,
    };
  });
};
