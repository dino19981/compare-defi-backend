import { VenusEarnItemDto } from '@modules/venus/types';
import { v4 as uuidv4 } from 'uuid';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnPlatform } from '../types';

export function formatVenusEarn(items: VenusEarnItemDto[]) {
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
        tokensWithMaxRate[market.underlyingSymbol] =
          formatVenusEarnItem(market);
      } else {
        if (maxRateObject.maxRate < +market.supplyApy) {
          tokensWithMaxRate[market.underlyingSymbol] =
            formatVenusEarnItem(market);
        }
      }
    });
  });

  return Object.values(tokensWithMaxRate);
}

export function formatVenusEarnItem(
  item: VenusEarnItemDto['markets'][number],
): EarnItem {
  return {
    id: uuidv4(),
    token: {
      name: item.underlyingSymbol === 'USDe' ? 'USDE' : item.underlyingSymbol,
    },
    periodType: 'flexible',
    platform: {
      link: 'https://app.venus.io/#/?chainId=56',
      name: EarnPlatform.Venus,
    },
    maxRate: +item.supplyApy,
    duration: infinityValue,
    productLevel: EarnItemLevel.Beginner,
  };
}
