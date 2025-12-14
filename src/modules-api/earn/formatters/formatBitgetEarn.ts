import { BitgetEarnDto } from '@modules/bitget/types';
import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { EarnPlatform } from '../types';
import { findTokenDataByName, TokenModel } from '@shared-modules/tokens';
import { addAnalyticsToLink } from '@shared-modules/analytics';
import { buildEarnItemId } from '../helpers';
import { DEFAULT_EARN_POSITIONS } from '../constants';

export const formatBitgetEarn = (
  items: BitgetEarnDto[],
  tokens: Record<string, TokenModel>,
) => {
  return items.reduce((acc: EarnItem[], item) => {
    const token = findTokenDataByName(item.coin, tokens);

    const data: Omit<EarnItem, 'id'> = {
      name: item.coin,
      token: {
        name: item.coin,
        icon: token?.image,
      },
      periodType: item.periodType,
      platform: {
        link: addAnalyticsToLink(
          'https://www.bitget.com/earning?clacCode=2RCF8FYU&from=%2Fevents%2Freferral-all-program&source=events',
        ),
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
      positions: DEFAULT_EARN_POSITIONS,
    };

    acc.push({
      id: buildEarnItemId(data),
      ...data,
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
