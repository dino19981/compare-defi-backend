import { NaviEarnItemDto } from 'src/modules/navi/types/NaviEarnDto';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { v4 as uuid } from 'uuid';
import { EarnPlatform } from '../types';

export const formatNaviEarn = (items: NaviEarnItemDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.token.symbol)) {
      return acc;
    }

    acc.push({
      id: uuid(),
      token: {
        name: item.token.symbol,
      },
      periodType: 'flexible',
      platform: {
        link: 'https://app.naviprotocol.io/?referralCode=606759880828653568',
        name: EarnPlatform.Navi,
      },
      maxRate: +item.supplyIncentiveApyInfo.apy,
      duration: infinityValue,
      productLevel: EarnItemLevel.Beginner,
    });

    return acc;
  }, []);
};
