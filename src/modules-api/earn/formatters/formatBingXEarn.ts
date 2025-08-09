import {
  EarnItem,
  EarnItemLevel,
  EarnItemRateSettings,
  infinityValue,
} from '../types/EarnItem';
import { isAvailableTokenForEarnings } from '../helpers';
import { BingXEarnDto, BingxEarnProduct } from '@modules/bingX/types';
import { EarnPlatform } from '../types';

export function formatBingXEarn(items: BingXEarnDto[]): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.assetName)) {
      return acc;
    }

    item.products.forEach((product) => {
      if (product.productName === 'SharkFin11') {
        return;
      }

      acc.push({
        id: product.productId.toString(),
        name: product.productName,
        token: {
          name: item.assetName,
        },
        periodType: 'flexible',
        duration: product.duration === -1 ? infinityValue : product.duration,
        ...(product.tieredApyRule &&
          formatTieredApyRule(product.tieredApyRule)),
        platform: {
          link: 'https://bingx.com/ru-ru/wealth/earn',
          name: EarnPlatform.BingX,
        },
        maxRate: +product.apy,
        productLevel: getProductLevel(product.tags),
      });
    });

    return acc;
  }, []);
}

function formatTieredApyRule(
  tieredApyRule: BingxEarnProduct['tieredApyRule'],
): { rateSettings: EarnItemRateSettings[] | undefined } {
  if (!tieredApyRule) {
    return {
      rateSettings: undefined,
    };
  }

  return {
    rateSettings: tieredApyRule.rules.map((rule) => ({
      min: +rule.low,
      max: +rule.high,
      apy: +rule.apy,
    })),
  };
}

function getProductLevel(tags: BingxEarnProduct['tags']): EarnItemLevel {
  if (!tags) {
    return EarnItemLevel.Beginner;
  }

  for (const tag of tags) {
    if (tag.tagId === 2) {
      return EarnItemLevel.NewUser;
    }
    if (tag.tagId === 1) {
      return EarnItemLevel.VIP;
    }
  }

  return EarnItemLevel.Beginner;
}
