import { SparkEarnDto } from '@modules/spark/types';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';

const coins = ['USDT', 'USDC'];

export function formatSparkEarn(
  data: SparkEarnDto | null,
  tokens: Record<string, TokenModel>,
) {
  if (!data) {
    return [];
  }

  return coins.map((coin) => {
    const token = findTokenDataByName(coin, tokens);

    const _data: Omit<EarnItem, 'id'> = {
      token: {
        name: coin,
        icon: token?.image,
      },
      periodType: 'flexible',
      platform: {
        link: addAnalyticsToLink('https://app.spark.fi/'),
        name: EarnPlatform.Spark,
      },
      maxRate: +data.rate * 100,
      productLevel: EarnItemLevel.Beginner,
      duration: infinityValue,
    };

    return {
      id: buildEarnItemId(_data),
      ..._data,
    };
  });
}
