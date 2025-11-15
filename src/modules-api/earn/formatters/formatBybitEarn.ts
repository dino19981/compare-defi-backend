import { EarnItem, EarnItemLevel, infinityValue } from '../types/EarnItem';
import { BybitEarnDto, BybitProductType } from '@modules/bybit/types';
import { v4 as uuidv4 } from 'uuid';
import {
  excludedByBitStackingProductTypes,
  getEarnItemNameByProductType,
} from '@modules/bybit/helpers';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

export function formatBybitEarn(
  items: BybitEarnDto[],
  tokens: Record<string, TokenModel>,
): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.tokenName!, tokens);

    item.product_types.forEach((productType) => {
      if (
        excludedByBitStackingProductTypes.includes(productType.product_type)
      ) {
        return;
      }

      acc.push({
        id: uuidv4(),
        name: getEarnItemNameByProductType(productType.product_type),
        token: {
          name: item.tokenName!,
          icon: token?.image || item.tokenImage,
        },
        periodType: 'flexible',
        platform: {
          link: addAnalyticsToLink(
            'https://www.bybit.com/en/earn/home?ref=5PDEAN',
          ),
          name: EarnPlatform.Bybit,
        },
        maxRate: +productType.apy_max_e8 / 1_000_000,
        rateSettings: getRateSettings(productType.tiered_apy_list),
        duration: getDuration(productType),
        productLevel: EarnItemLevel.Beginner,
      });
    });

    return acc;
  }, []);
}

function getRateSettings(items: BybitProductType['tiered_apy_list']) {
  return items.map((productType) => ({
    apy: +productType.apy_e8 / 1_000_000,
    min: +productType.from_num,
    max: productType.to_num === '-1' ? infinityValue : +productType.to_num,
  }));
}

function getDuration(productType: BybitProductType) {
  if (productType.duration_max === 0) {
    return infinityValue;
  }

  return productType.duration_max || productType.duration_min;
}
