import { EarnItem, EarnItemLevel } from '../types';
import { isAvailableTokenForEarnings } from '../helpers';
import { KucoinEarnDto } from '@modules/kukoin/types';
import { v4 as uuid } from 'uuid';

export const formatKukoinEarn = (items: KucoinEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.currency)) {
      return acc;
    }

    item.products.forEach((product) => {
      acc.push({
        id: uuid(),
        token: {
          name: item.currency,
        },
        periodType: 'flexible',
        platform: {
          link: 'https://www.kucoin.com/r/rf/A1LX17VF',
          name: 'Kucoin',
        },
        rates: [
          {
            currentApy: product.apr ? +product.apr : +product.total_apr,
            rateLevel: 0,
          },
        ],
        productLevel: EarnItemLevel.Beginner,
      });
    });

    return acc;
  }, []);
};
