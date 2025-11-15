import { VenusEarnItemDto } from '@modules/venus/types';
import { v4 as uuidv4 } from 'uuid';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

export function formatVenusEarn(
  items: VenusEarnItemDto[],
  tokens: Record<string, TokenModel>,
) {
  const tokensWithMaxRate: Record<string, EarnItem> = {};

  items.forEach((item) => {
    item.markets.forEach((market) => {
      if (
        !market.underlyingSymbol ||
        !isAvailableTokenForEarnings(market.underlyingSymbol)
      ) {
        return;
      }

      const maxRateObject = tokensWithMaxRate[market.underlyingSymbol];

      if (!maxRateObject) {
        tokensWithMaxRate[market.underlyingSymbol] = formatVenusEarnItem(
          market,
          tokens,
        );
      } else {
        if (maxRateObject.maxRate < +market.supplyApy) {
          tokensWithMaxRate[market.underlyingSymbol] = formatVenusEarnItem(
            market,
            tokens,
          );
        }
      }
    });
  });

  return Object.values(tokensWithMaxRate);
}

export function formatVenusEarnItem(
  item: VenusEarnItemDto['markets'][number],
  tokens: Record<string, TokenModel>,
): EarnItem {
  const token = findTokenDataByName(item.underlyingSymbol, tokens);

  return {
    id: uuidv4(),
    token: {
      name: item.underlyingSymbol === 'USDe' ? 'USDE' : item.underlyingSymbol,
      icon: token?.image,
    },
    periodType: 'flexible',
    platform: {
      link: addAnalyticsToLink('https://app.venus.io/#/?chainId=56'),
      name: EarnPlatform.Venus,
    },
    maxRate: +item.supplyApy,
    duration: infinityValue,
    productLevel: EarnItemLevel.Beginner,
  };
}
