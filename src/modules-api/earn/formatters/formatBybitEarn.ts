import { EarnItem, EarnItemLevel } from '../types/EarnItem';
import { isAvailableTokenForEarnings } from '../helpers';
import { BybitEarnDto } from '@modules/bybit/types';
import { v4 as uuidv4 } from 'uuid';
import { getEarnItemNameByProductType } from '@modules/bybit/helpers';

const coinNameByCoinNumber: Record<number, string> = {
  1: 'BTC',
  2: 'ETH',
  5: 'USDT',
  6: 'USDC',
  8: 'SOL',
  624: 'USDE',
};

export function formatBybitEarn(items: BybitEarnDto[]): EarnItem[] {
  return items.reduce((acc: EarnItem[], item) => {
    const coinName = coinNameByCoinNumber[item.coin];

    if (!coinName || !isAvailableTokenForEarnings(coinName)) {
      return acc;
    }

    item.product_types.forEach((productType) => {
      acc.push({
        id: uuidv4(),
        name: getEarnItemNameByProductType(productType.product_type),
        token: {
          name: coinName,
        },
        periodType: 'flexible',
        platform: {
          link: 'https://www.bybit.com/en/earn/home?ref=5PDEAN',
          name: 'ByBit',
        },
        rates: [
          {
            currentApy: +productType.apy_max_e8 / 1_000_000,
            rateLevel: 0,
          },
        ],
        productLevel: EarnItemLevel.Beginner,
      });
    });

    return acc;
  }, []);
}
