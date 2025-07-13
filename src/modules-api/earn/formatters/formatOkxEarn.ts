import { OkxEarnDto } from 'src/modules/okx/types';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnItem, EarnItemLevel } from '../types';
import { v4 as uuid } from 'uuid';

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
      periodType: 'flexible',
      platform: {
        link: 'https://okx.com/join/41728095',
        name: 'Okx',
      },
      rates: [
        {
          currentApy: +item.rate.rateNum.value[0],
          rateLevel: 0,
        },
      ],
      productLevel: EarnItemLevel.Beginner,
    });

    return acc;
  }, []);
};
