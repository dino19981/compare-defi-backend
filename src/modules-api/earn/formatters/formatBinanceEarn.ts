import {
  BinanceEarnDto,
  BinanceProductSummaryType,
} from '@modules/binance/types/binanceEarnDto';
import { EarnItem, EarnItemLevel, infinityValue } from '../types/EarnItem';
import { EarnPlatform } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

export function formatBinanceEarn(
  items: BinanceEarnDto[],
  tokens: Record<string, TokenModel>,
): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    const simpleEarnData = item.productDetailList?.filter(
      (product) =>
        product.productType !== BinanceProductSummaryType.DualCurrency,
    );

    if (!simpleEarnData.length) {
      return acc;
    }

    const tokenImage = findTokenDataByName(item.asset, tokens)?.image;

    simpleEarnData.forEach((product) => {
      acc.push({
        id: uuidv4(),
        name: 'Simple Earn',
        token: {
          name: item.asset,
          icon: tokenImage,
        },
        duration: infinityValue,
        periodType: 'flexible',
        platform: {
          link: addAnalyticsToLink(
            'https://www.binance.com/en/earn?ref=CPA_00CR5Q0KBD',
          ),
          name: EarnPlatform.Binance,
        },
        maxRate: +product.apy * 100,
        productLevel: EarnItemLevel.Beginner,
      });
    });

    return acc;
  }, []);
}
