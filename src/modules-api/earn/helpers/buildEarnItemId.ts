import { createHash } from 'node:crypto';
import { EarnItem } from '../types';

export const buildEarnItemId = (
  item: Omit<EarnItem, 'id'>,
  otherFields?: (string | number)[],
): string => {
  const baseHashString = `${item.platform.name}-${item.token.name}-${item.productLevel}-${item.duration}`;
  const hashString = otherFields
    ? `${baseHashString}-${otherFields.join('-')}`
    : baseHashString;

  return createHash('sha256').update(hashString).digest('hex');
};
