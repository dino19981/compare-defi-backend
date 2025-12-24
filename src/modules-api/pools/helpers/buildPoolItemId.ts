import { createHash } from 'node:crypto';
import { PoolItem } from '../types';

export const buildPoolItemId = (
  item: Omit<PoolItem, 'id'>,
  otherFields?: (string | number)[],
): string => {
  const baseHashString = `${item.platform.name}-${item.firstToken.name}-${item.secondToken.name}-${item.fee}`;
  const hashString = otherFields
    ? `${baseHashString}-${otherFields.join('-')}`
    : baseHashString;

  return createHash('sha256').update(hashString).digest('hex');
};
