import { NaviEarnItemDto } from 'src/modules/navi/types/NaviEarnDto';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { v4 as uuid } from 'uuid';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

export const formatNaviEarn = (
  items: NaviEarnItemDto[],
  tokens: Record<string, TokenModel>,
) => {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.token.symbol, tokens);

    acc.push({
      id: uuid(),
      token: {
        name: item.token.symbol,
        icon: token?.image,
      },
      periodType: 'flexible',
      platform: {
        link: addAnalyticsToLink(
          'https://app.naviprotocol.io/?referralCode=606759880828653568',
        ),
        name: EarnPlatform.Navi,
      },
      maxRate: +item.supplyIncentiveApyInfo.apy,
      duration: infinityValue,
      productLevel: EarnItemLevel.Beginner,
    });

    return acc;
  }, []);
};
