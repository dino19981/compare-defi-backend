import { SparkEarnDto } from '@modules/spark/types';
import { v4 as uuidv4 } from 'uuid';
import { EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';

const coins = ['USDT', 'USDC'];

export function formatSparkEarn(data: SparkEarnDto | null) {
  if (!data) {
    return [];
  }

  return coins.map((coin) => ({
    id: uuidv4(),
    token: {
      name: coin,
    },
    periodType: 'flexible',
    platform: {
      link: 'https://app.spark.fi/',
      name: EarnPlatform.Spark,
    },
    maxRate: +data.rate * 100,
    productLevel: EarnItemLevel.Beginner,
    duration: infinityValue,
  }));
}
