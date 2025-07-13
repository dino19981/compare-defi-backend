import {
  BinanceEarnDto,
  BinanceProductSummaryType,
} from '@modules/binance/types/binanceEarnDto';
import { EarnItem, EarnItemLevel } from '../types/EarnItem';
import { isAvailableTokenForEarnings } from '../helpers';

export function formatBinanceEarn(items: BinanceEarnDto[]): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.asset)) {
      return acc;
    }
    const simpleEarnData = item.productSummary?.find(
      (product) => product.productType === BinanceProductSummaryType.SimpleEarn,
    );

    if (!simpleEarnData) {
      return acc;
    }

    acc.push({
      id: simpleEarnData.productId,
      token: {
        name: item.asset,
      },
      periodType: 'flexible',
      platform: {
        link: 'https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00CR5Q0KBD',
        name: 'Binance',
      },
      rates: [
        {
          // todo: binance возвращает apr в процентах, поэтому умножаем на 100
          currentApy: +simpleEarnData.maxApr * 100,
          rateLevel: 0,
        },
      ],
      productLevel: EarnItemLevel.Beginner,
    });

    return acc;
  }, []);
}
