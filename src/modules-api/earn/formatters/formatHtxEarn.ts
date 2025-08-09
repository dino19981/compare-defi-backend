import { HtxEarnDto } from '@modules/htx/types';
import { isAvailableTokenForEarnings } from '../helpers';
import { v4 as uuid } from 'uuid';
import {
  EarnItem,
  EarnItemBadge,
  EarnItemLevel,
  infinityValue,
} from '../types';
import { EarnPlatform } from '../types';

// dual invest и прочая залупа, которая не подходит под наши условия
const badEnumTypes = [6, 10, 11];

export const formatHtxEarn = (items: HtxEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.currency)) {
      return acc;
    }

    item.projectList.forEach((product) => {
      if (
        !product.viewYearRate ||
        badEnumTypes.includes(product.projectEnumType)
      ) {
        return;
      }

      const apy = product.viewYearRate * 100;

      acc.push({
        id: uuid(),
        token: {
          name: item.currency,
        },
        periodType: 'flexible',
        duration: getDuration(product.term),
        platform: {
          link: 'https://www.htx.com/ru-ru/financial/earn/?type=limit&invite_code=8czja223',
          name: EarnPlatform.Htx,
        },
        maxRate: apy,
        productLevel: EarnItemLevel.Beginner,
        // у всех токенов с 100% APY маленький лимит
        badges: getBadges(apy, product.type),
      });
    });

    return acc;
  }, []);
};

function getDuration(term: number) {
  if (term === -1 || term === null || term > 200) {
    return infinityValue;
  }

  return term;
}

function getBadges(apy: number, type: number) {
  const badges: EarnItemBadge[] = [];

  if (apy === 100) {
    badges.push(EarnItemBadge.SmallLimit);
  }

  if (type === 1) {
    badges.push(EarnItemBadge.ForNewUsers);
  }

  return badges.length > 0 ? badges : undefined;
}
