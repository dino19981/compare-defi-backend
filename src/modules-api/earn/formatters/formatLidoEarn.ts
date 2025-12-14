import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';
import { DEFAULT_EARN_POSITIONS } from '../constants';

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

    const data: Omit<EarnItem, 'id'> = {
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
      positions: DEFAULT_EARN_POSITIONS,
    };

    return {
      id: buildEarnItemId(data),
      ...data,
    };
  });
};
