import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';
import { DEFAULT_EARN_POSITIONS } from '../constants';

export const formatJitoEarn = (
  items: { name: string; apr: number }[],
  tokens: Record<string, TokenModel>,
) => {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.name, tokens);

    const data: Omit<EarnItem, 'id'> = {
      token: {
        name: item.name,
        icon: token?.image,
      },
      periodType: 'flexible',
      platform: {
        link: addAnalyticsToLink('https://www.jito.network/'),
        name: EarnPlatform.Jito,
      },
      maxRate: +item.apr * 100,
      duration: infinityValue,
      productLevel: EarnItemLevel.Beginner,
      positions: DEFAULT_EARN_POSITIONS,
    };

    acc.push({
      id: buildEarnItemId(data),
      ...data,
    });

    return acc;
  }, []);
};
