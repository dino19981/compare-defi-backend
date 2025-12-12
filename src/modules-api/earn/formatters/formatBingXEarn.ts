import {
  EarnItem,
  EarnItemLevel,
  EarnItemRateSettings,
  infinityValue,
} from '../types/EarnItem';
import { BingXEarnDto, BingxEarnProduct } from '@modules/bingX/types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';

export function formatBingXEarn(
  items: BingXEarnDto[],
  tokens: Record<string, TokenModel>,
): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.assetName, tokens);

    item.products.forEach((product) => {
      if (product.productName.toLocaleLowerCase().includes('shark')) {
        return;
      }

      const data: Omit<EarnItem, 'id'> = {
        name: product.productName,
        token: {
          name: item.assetName,
          icon: token?.image || item.icon,
        },
        periodType: 'flexible',
        duration: product.duration === -1 ? infinityValue : product.duration,
        ...(product.tieredApyRule &&
          formatTieredApyRule(product.tieredApyRule)),
        platform: {
          link: addAnalyticsToLink('https://bingx.com/wealth/earn'),
          name: EarnPlatform.BingX,
        },
        maxRate: +product.apy,
        productLevel: getProductLevel(product.tags),
      };

      acc.push({
        id: buildEarnItemId(data),
        ...data,
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
