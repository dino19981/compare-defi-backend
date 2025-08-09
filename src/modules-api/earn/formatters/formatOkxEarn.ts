import { OkxEarnDto } from 'src/modules/okx/types';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { v4 as uuid } from 'uuid';
import { EarnPlatform } from '../types';

export const formatOkxEarn = (items: OkxEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.investCurrency.currencyName)) {
      return acc;
    }

    acc.push({
      id: uuid(),
      token: {
        name: item.investCurrency.currencyName,
      },
      duration: infinityValue,
      periodType: 'flexible',
      platform: {
        link: 'https://okx.com/join/41728095',
        name: EarnPlatform.Okx,
      },
      maxRate: Math.max(...item.rate.rateNum.value.map(Number)),
      productLevel: EarnItemLevel.Beginner,
    });

    return acc;
  }, []);
};
