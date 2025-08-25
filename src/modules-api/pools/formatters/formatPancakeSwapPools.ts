import { PancakeSwapPoolDto } from '@modules/pancakeSwap/types';
import { PoolItem, PoolPlatform } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Chain } from 'src/shared/modules/chains';

export function formatPancakeSwapPools(
  items: PancakeSwapPoolDto[],
  chains: Record<number, Chain>,
): PoolItem[] {
  return items.reduce((acc: PoolItem[], item) => {
    const chain = chains[item.chainId] || {
      name: 'Unknown',
      image: {
        small: `https://assets.pancakeswap.finance/web/chains/square/${item.chainId}.svg`,
      },
    };

    if (!item.pool?.token0?.symbol || !item.pool?.token1?.symbol) {
      return acc;
    }

    if (!chains[item.chainId]) {
      console.log(item.chainId, ' not found for pancakeswap');
    }

    acc.push({
      id: uuidv4(),

      firstToken: {
        name: item.pool.token0.symbol,
        imageUrl: `https://tokens.pancakeswap.finance/images/symbol/${item.pool.token0.symbol}.png`,
      },
      secondToken: {
        name: item.pool.token1.symbol,
        imageUrl: `https://tokens.pancakeswap.finance/images/symbol/${item.pool.token1.symbol}.png`,
      },
      platform: {
        name: PoolPlatform.PancakeSwap,
        link: 'https://pancakeswap.finance/liquidity/pools',
      },

      chain: {
        name: chain.name,
        imageUrl: chain.image.small,
      },

      tvl: +item.tvlUSD,
      volume: +item.vol24hUsd,
      fee: +item.pool.fee / 10_000,

      apr: item.apr24h * 100,

      badges: [],
    });
    return acc;
  }, []);
}
