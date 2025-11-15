import {
  EarnItem,
  EarnItemBadge,
  EarnItemLevel,
  infinityValue,
} from '../types';
import { KucoinEarnDto } from '@modules/kukoin/types';
import { v4 as uuid } from 'uuid';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

const maxCount = 3;

export const formatKukoinEarn = (
  items: KucoinEarnDto[],
  tokens: Record<string, TokenModel>,
) => {
  return items.reduce((acc: EarnItem[], item) => {
    let count = 0;

    item.products.forEach((product) => {
      if (product.category.toLowerCase().trim().includes('shark')) {
        return;
      }

      const token = findTokenDataByName(item.currency, tokens);

      if (count >= maxCount) {
        return;
      }

      count++;

      acc.push({
        id: uuid(),
        token: {
          name: item.currency,
          icon: token?.image,
        },
        periodType: 'flexible',
        platform: {
          link: addAnalyticsToLink('https://www.kucoin.com/ru/earn'),
          refLink: addAnalyticsToLink('https://www.kucoin.com/r/rf/A1LX17VF'),
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
