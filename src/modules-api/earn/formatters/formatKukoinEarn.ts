import {
  EarnItem,
  EarnItemBadge,
  EarnItemLevel,
  infinityValue,
} from '../types';
import { isAvailableTokenForEarnings } from '../helpers';
import { KucoinEarnDto } from '@modules/kukoin/types';
import { v4 as uuid } from 'uuid';
import { EarnPlatform } from '../types';

const badCategories = ['SHARKFIN', 'Shark Fin'];
const maxCount = 3;

export const formatKukoinEarn = (items: KucoinEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.currency)) {
      return acc;
    }

    let count = 0;

    item.products.forEach((product) => {
      if (badCategories.includes(product.category)) {
        return;
      }

      if (count >= maxCount) {
        return;
      }

      count++;

      acc.push({
        id: uuid(),
        token: {
          name: item.currency,
        },
        periodType: 'flexible',
        platform: {
          link: 'https://www.kucoin.com/ru/earn',
          refLink: 'https://www.kucoin.com/r/rf/A1LX17VF',
          name: EarnPlatform.Kucoin,
        },
        maxRate: product.apr ? +product.apr : +product.total_apr,
        productLevel: EarnItemLevel.Beginner,
        duration: product.duration === 0 ? infinityValue : product.duration,
        badges: product?.tags?.includes('NEWBIE')
          ? [EarnItemBadge.ForNewUsers, EarnItemBadge.SmallLimit]
          : undefined,
      });
    });

    return acc;
  }, []);
};
