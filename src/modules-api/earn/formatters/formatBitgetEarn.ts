import { BitgetEarnDto } from '@modules/bitget/types';
import { EarnItem, EarnItemLevel } from '../types';
import { isAvailableTokenForEarnings } from '../helpers';

export const formatBitgetEarn = (items: BitgetEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.coin)) {
      return acc;
    }

    acc.push({
      id: item.productId,
      token: {
        name: item.coin,
      },
      periodType: item.periodType,
      platform: {
        link: 'https://share.bitget.com/u/G2556G9Q',
        name: 'Bitget',
      },
      rates: item.apyList.map((item) => ({
        currentApy: +item.currentApy,
        rateLevel: +item.rateLevel,
      })),
      productLevel: item.productLevel as never as EarnItemLevel,
    });

    return acc;
  }, []);
};
