import { SparkEarnDto } from '@modules/spark/types';
import { v4 as uuidv4 } from 'uuid';
import { EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';

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

    return {
      id: uuidv4(),
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
  });
}
