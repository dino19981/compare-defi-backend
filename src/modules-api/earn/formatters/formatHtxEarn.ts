import { HtxEarnDto } from '@modules/htx/types';
import { isAvailableTokenForEarnings } from '../helpers';
import { v4 as uuid } from 'uuid';
import { EarnItem, EarnItemLevel } from '../types';

export const formatHtxEarn = (items: HtxEarnDto[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    if (!isAvailableTokenForEarnings(item.currency)) {
      return acc;
    }

    item.projectList.forEach((product) => {
      acc.push({
        id: uuid(),
        token: {
          name: item.currency,
        },
        periodType: 'flexible',
        platform: {
          link: 'https://www.htx.com/invite/en-us/1f?invite_code=8czja223',
          name: 'Htx',
        },
        rates: [
          {
            // возвращается процент деленный на 100
            currentApy: product.viewYearRate * 100,
            rateLevel: 0,
          },
        ],
        productLevel: EarnItemLevel.Beginner,
      });
    });

    return acc;
  }, []);
};
