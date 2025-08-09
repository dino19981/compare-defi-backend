import { EarnItem, EarnItemLevel, infinityValue } from '../types';
import { v4 as uuid } from 'uuid';
import { EarnPlatform } from '../types';

export const formatJitoEarn = (items: { name: string; apr: number }[]) => {
  return items.reduce((acc: EarnItem[], item) => {
    acc.push({
      id: uuid(),
      token: {
        name: item.name,
      },
      periodType: 'flexible',
      platform: {
        link: 'https://www.jito.network/',
        name: EarnPlatform.Jito,
      },
      maxRate: +item.apr * 100,
      duration: infinityValue,
      productLevel: EarnItemLevel.Beginner,
    });

    return acc;
  }, []);
};
