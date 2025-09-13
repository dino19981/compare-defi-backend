import { LendingPlatformName } from '../types/LendingPlatformName';

export function buildLendingItemKey(
  platform: LendingPlatformName,
  chain: string,
  token: string,
): string {
  return `${platform}-${chain}-${token}`;
}
