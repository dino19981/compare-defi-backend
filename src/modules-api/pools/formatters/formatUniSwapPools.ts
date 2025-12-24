import { PoolItem, PoolPlatform } from '../types';
import { Chain } from 'src/shared/modules/chains';
import { UniSwapPoolDto } from '@modules/uniswap/types';
import { buildPoolItemId } from '../helpers';
import { DEFAULT_POOL_POSITIONS } from '../constants';

export function formatUniSwapPools(
  items: UniSwapPoolDto[],
  chains: Record<string, Chain>,
): PoolItem[] {
  return items.reduce((acc: PoolItem[], item) => {
    const chain = chains[item.chain.toLowerCase()];

    if (!chain) {
      console.log(item.chain.toLowerCase(), ' not found for uniswap');
      return acc;
    }

    const volume = +item.volume1Day.value;
    const fee = +item.feeTier / 10_000 || 0.3;
    const totalLiquidity = +item.totalLiquidity.value;

    // ((volume24h × fee_rate) / totalLiquidity) \* 365 - годовая ставка
    const baseApr = ((volume * fee) / totalLiquidity) * 365;

    const data = {
      firstToken: {
        name: item.token0.symbol,
        imageUrl: item.token0.logo,
      },
      secondToken: {
        name: item.token1.symbol,
        imageUrl: item.token1.logo,
      },
      platform: {
        name: PoolPlatform.Uniswap,
        link: 'https://app.uniswap.org/explore/pools/unichain',
      },

      chain: {
        name: chain.name,
        imageUrl: chain.image.small,
      },

      tvl: totalLiquidity,
      volume: volume,
      fee,

      apr: item.boostedApr ? baseApr + item.boostedApr : baseApr,

      badges: [],
      positions: DEFAULT_POOL_POSITIONS,
    };

    acc.push({
      ...data,
      id: buildPoolItemId(data),
    });
    return acc;
  }, []);
}
