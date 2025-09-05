import { PoolItem, PoolPlatform } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Chain } from 'src/shared/modules/chains';
import { CetusPool } from '@modules/cetus/types/CetusEarn.dto';

const SUI_CHAIN_ID = 'sui';

export function formatCetusPools(
  items: CetusPool[],
  chains: Record<number, Chain>,
): PoolItem[] {
  return items.reduce((acc: PoolItem[], item) => {
    const chain = chains[SUI_CHAIN_ID];

    if (!item.coinA?.symbol || !item.coinB?.symbol) {
      return acc;
    }

    acc.push({
      id: uuidv4(),

      firstToken: {
        name: item.coinA.symbol,
        imageUrl: item.coinA.logoURL,
      },
      secondToken: {
        name: item.coinB.symbol,
        imageUrl: item.coinB.logoURL,
      },
      platform: {
        name: PoolPlatform.Cetus,
        link: 'https://app.cetus.zone/pools',
      },

      chain: {
        name: chain.name,
        imageUrl: chain.image.small,
      },

      tvl: +item.tvl,
      volume: +item.stats[0].vol,
      fee: +item.feeRate / 10_000,

      apr: +item.totalApr * 100,

      badges: [],
    });
    return acc;
  }, []);
}
