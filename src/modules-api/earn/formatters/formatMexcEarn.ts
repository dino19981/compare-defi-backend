import {
  EarnItem,
  EarnItemBadge,
  EarnItemLevel,
  infinityValue,
} from '../types/EarnItem';
import { AvailableTokensForEarn } from '../helpers';
import { MexcEarnItem, MexcEarnProduct } from '@modules/mexc/types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';

const forNewUsersLimits: Record<AvailableTokensForEarn, number> = {
  USDT: 100,
  USDC: 100,
  ETH: 50,
  WETH: 50,
  BTC: 50,
  USDE: 50,
  SOL: 50,
  suiUSDT: 100,
  wUSDT: 100,
  wUSDC: 100,
  suiWBTC: 100,
  WBTC: 100,
  LBTC: 100,
  SUI: 100,
  vSUI: 100,
  stSUI: 100,
  haSUI: 100,
};

// проверить маппинг
export function formatMexcEarn(
  items: MexcEarnItem[],
  tokens: Record<string, TokenModel>,
): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.currency, tokens);

    [...(item.lockPosList || []), ...(item.holdPosList || [])].forEach(
      (product) => {
        const apy = product.stepRateList
          ? (product.maxStepRate ?? 0) * 100
          : +product.profitRate * 100;
        const isForNewUsers = apy > forNewUsersLimits[item.currency];

        const data: Omit<EarnItem, 'id'> = {
          token: {
            name: item.currency,
            icon: token?.image,
          },
          duration: isForNewUsers
            ? (product.minLockDays ?? infinityValue)
            : infinityValue,
          periodType: 'flexible',
          platform: {
            link: addAnalyticsToLink(
              'https://www.mexc.com/staking?inviteCode=3KJXS',
            ),
            name: EarnPlatform.Mexc,
          },
          maxRate: apy,
          ...getRateSettings(product.stepRateList),
          productLevel: EarnItemLevel.Beginner,
          badges: isForNewUsers
            ? [EarnItemBadge.ForNewUsers, EarnItemBadge.SmallLimit]
            : undefined,
        };

        acc.push({
          id: buildEarnItemId(data, [product.id]),
          ...data,
        });
      },
    );

    return acc;
  }, []);
}

function getRateSettings(stepRateList: MexcEarnProduct['stepRateList']) {
  if (!stepRateList) {
    return {};
  }

  return {
    rateSettings: stepRateList.map((rate) => ({
      min: +rate.startLockQuantity,
      max:
        rate.endLockQuantity === null ? infinityValue : +rate.endLockQuantity,
      apy: +rate.stepRate * 100,
    })),
  };
}
