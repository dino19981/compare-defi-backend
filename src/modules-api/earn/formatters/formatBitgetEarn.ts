import { BitgetEarnDto } from '@modules/bitget/types';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { isAvailableTokenForEarnings } from '../helpers';
import { EarnPlatform } from '../types';

export const formatBitgetEarn = (items: BitgetEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.coin)) {
      return acc;
    }

    acc.push({
      id: item.productId,
      name: item.coin,
      token: {
        name: item.coin,
      },
      periodType: item.periodType,
      platform: {
        link: 'https://www.bitget.com/ru/earning',
        name: EarnPlatform.Bitget,
      },
      maxRate: getMaxRate(item),
      ...(item.apyList.length > 1 && {
        rateSettings: item.apyList.map((item) => ({
          apy: +item.currentApy,
          min: +item.minStepVal,
          max: +item.maxStepVal,
          rateLevel: +item.rateLevel,
        })),
      }),
      duration: item.periodType === 'flexible' ? infinityValue : +item.period,
      productLevel: item.productLevel.toLowerCase() as never as EarnItemLevel,
    });

    return acc;
  }, []);
};

function getMaxRate(item: BitgetEarnDto) {
  let maxRate = 0;

  item.apyList.forEach((item) => {
    if (+item.currentApy > maxRate) {
      maxRate = +item.currentApy;
    }
  });

  return maxRate;
}
