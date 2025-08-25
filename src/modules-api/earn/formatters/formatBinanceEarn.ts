import {
  BinanceEarnDto,
  BinanceProductSummaryType,
} from '@modules/binance/types/binanceEarnDto';
import { EarnItem, EarnItemLevel, infinityValue } from '../types/EarnItem';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnPlatform } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function formatBinanceEarn(items: BinanceEarnDto[]): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.asset)) {
      return acc;
    }

    const simpleEarnData = item.productSummary?.filter(
      (product) =>
        product.productType !== BinanceProductSummaryType.DualCurrency,
    );

    if (!simpleEarnData.length) {
      return acc;
    }

    simpleEarnData.forEach((product) => {
      acc.push({
        id: uuidv4(),
        name: 'Simple Earn',
        token: {
          name: item.asset,
        },
        duration: infinityValue,
        periodType: 'flexible',
        platform: {
          link: 'https://www.binance.com/en/earn?ref=CPA_00CR5Q0KBD',
          name: EarnPlatform.Binance,
        },
        maxRate: +product.maxApr * 100,
        productLevel: EarnItemLevel.Beginner,
      });
    });

    return acc;
  }, []);
}
