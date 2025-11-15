import { HtxEarnDto } from '@modules/htx/types';
import { v4 as uuid } from 'uuid';
import {
  EarnItem,
  EarnItemBadge,
  EarnItemLevel,
  infinityValue,
} from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

// dual invest и прочая залупа, которая не подходит под наши условия
const badEnumTypes = [6, 10, 11];

export const formatHtxEarn = (
  items: HtxEarnDto[],
  tokens: Record<string, TokenModel>,
) => {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.currency, tokens);

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
          icon: token?.image || item.icon,
        },
        periodType: 'flexible',
        duration: getDuration(product.term),
        platform: {
          link: addAnalyticsToLink(
            'https://www.htx.com/financial/earn/?type=limit&invite_code=8czja223',
          ),
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
