import { HtxEarnDto, HtxEarnType } from '@modules/htx/types';
import {
  EarnItem,
  EarnItemBadge,
  EarnItemLevel,
  infinityValue,
} from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';
import { DEFAULT_EARN_POSITIONS } from '../constants';

// dual invest и прочая хрень, которая не подходит под наши условия
const badEnumTypes = [6, 10, 11];

const currentProjectTypeByType: Record<HtxEarnType, number> = {
  [HtxEarnType.Flexible]: 5,
  [HtxEarnType.Recommended]: 999,
  [HtxEarnType.Fixed]: 2,
  [HtxEarnType.LimitList]: 1,
};

export const formatHtxEarn = (
  items: HtxEarnDto[],
  tokens: Record<string, TokenModel>,
) => {
  // Данные могут повторяться
  const usedEarnItemsIds = new Set<string>();

  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.currency, tokens);

    item.projectList.forEach((product) => {
      if (
        !product.viewYearRate ||
        !product.productId ||
        usedEarnItemsIds.has(product.productId) ||
        badEnumTypes.includes(product.projectEnumType)
      ) {
        return;
      }
      usedEarnItemsIds.add(product.productId);

      const apy = product.viewYearRate * 100;

      const data: Omit<EarnItem, 'id'> = {
        token: {
          name: item.currency,
          icon: token?.image || item.icon,
        },
        periodType: 'flexible',
        duration: getDuration(product.term),
        platform: {
          link: addAnalyticsToLink(
            `https://www.htx.com/en-us/financial/earn/?type=limit&invite_code=9czja223&currentProjectType=${currentProjectTypeByType[item.type]}`,
          ),
          name: EarnPlatform.Htx,
        },
        maxRate: apy,
        productLevel: EarnItemLevel.Beginner,
        // у всех токенов с 100% APY маленький лимит
        badges: getBadges(apy, product.type),
        positions: DEFAULT_EARN_POSITIONS,
      };

      const id = buildEarnItemId(data, [product.productId]);

      acc.push({
        id,
        ...data,
      });
    });

    return acc;
  }, []);
};

function getDuration(term: number) {
  if (term === -1 || term === null || term > 200 || term == 0) {
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
