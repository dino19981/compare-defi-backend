import { NaviEarnItemDto } from 'src/modules/navi/types/NaviEarnDto';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';

export const formatNaviEarn = (
  items: NaviEarnItemDto[],
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
        link: addAnalyticsToLink(
          'https://app.naviprotocol.io/?referralCode=606759880828653568',
        ),
        name: EarnPlatform.Navi,
      },
      maxRate: item.instantAPR,
      duration: infinityValue,
      productLevel: EarnItemLevel.Beginner,
    };

    acc.push({
      id: buildEarnItemId(data, [item.id]),
      ...data,
    });

    return acc;
  }, []);
};
