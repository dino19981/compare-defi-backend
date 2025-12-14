import { OkxEarnDto } from 'src/modules/okx/types';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';
import { DEFAULT_EARN_POSITIONS } from '../constants';

export const formatOkxEarn = (
  items: OkxEarnDto[],
  tokens: Record<string, TokenModel>,
) => {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.investCurrency.currencyName, tokens);

    const data: Omit<EarnItem, 'id'> = {
      token: {
        name: item.investCurrency.currencyName,
        icon: token?.image || item.investCurrency.currencyIcon,
      },
      duration: infinityValue,
      periodType: 'flexible',
      platform: {
        refLink: addAnalyticsToLink('https://okx.com/join/41728095'),
        link: addAnalyticsToLink('https://www.okx.com/ru/earn/simple-earn'),
        name: EarnPlatform.Okx,
      },
      maxRate: Math.max(...item.rate.rateNum.value.map(Number)),
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
