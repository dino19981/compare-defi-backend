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
import { DEFAULT_EARN_POSITIONS } from '../constants';

const forNewUsersLimits: Record<AvailableTokensForEarn, number> = {
  USDT: 401,
  USDC: 401,
  ETH: 50,
  WETH: 50,
  BTC: 50,
  USDE: 50,
  SOL: 50,
  suiUSDT: 100,
  wUSDT: 400,
  wUSDC: 400,
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

    item.financialProductList.forEach((product) => {
      if (product.soldOut) {
        return;
      }

      const apy = product.showApr ? +product.showApr : +product.baseApr;
      const isForNewUsers = apy > forNewUsersLimits[item.currency];

      const data: Omit<EarnItem, 'id'> = {
        token: {
          name: item.currency,
          icon: token?.image,
        },
        duration: product.fixedInvestPeriodCount ?? infinityValue,
        periodType: 'flexible',
        platform: {
          link: addAnalyticsToLink(
            'https://www.mexc.com/staking?inviteCode=121CbH',
          ),
          name: EarnPlatform.Mexc,
        },
        maxRate: apy,
        ...getRateSettings(product),
        productLevel: EarnItemLevel.Beginner,
        badges: isForNewUsers
          ? [EarnItemBadge.ForNewUsers, EarnItemBadge.SmallLimit]
          : undefined,
        positions: DEFAULT_EARN_POSITIONS,
      };

      acc.push({
        id: buildEarnItemId(data, [product.financialId]),
        ...data,
      });
    });

    return acc;
  }, []);
}

function getRateSettings(product: MexcEarnProduct) {
  const stepRateList = product.tieredSubsidyApr;

  if (!stepRateList) {
    return {};
  }

  return {
    rateSettings: stepRateList.map((rate) => ({
      min: +rate.startQuantity,
      max: rate.endQuantity === null ? infinityValue : +rate.endQuantity,
      apy: +rate.apr + +product.baseApr,
    })),
  };
}
