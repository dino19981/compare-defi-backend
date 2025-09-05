import { PoolItem, PoolPlatform } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Chain } from 'src/shared/modules/chains';
import { RaydiumPool } from '@modules/raydium/types/RaydiumPool.dto';

const SOLANA_CHAIN_ID = 'solana';

export function formatRaydiumPools(
  items: RaydiumPool[],
  chains: Record<number, Chain>,
): PoolItem[] {
  return items.reduce((acc: PoolItem[], item) => {
    const chain = chains[SOLANA_CHAIN_ID];

    if (!item.mintA?.symbol || !item.mintB?.symbol) {
      return acc;
    }

    acc.push({
      id: uuidv4(),

      firstToken: {
        name: item.mintA.symbol,
        imageUrl: item.mintA.logoURI,
      },
      secondToken: {
        name: item.mintB.symbol,
        imageUrl: item.mintB.logoURI,
      },
      platform: {
        name: PoolPlatform.Raydium,
        link: 'https://raydium.io/liquidity-pools/',
      },

      chain: {
        name: chain.name,
        imageUrl: chain.image.small,
      },

      tvl: item.tvl,
      volume: item.day.volume,
      fee: item.feeRate * 100,

      apr: item.day.apr,

      badges: [],
    });
    return acc;
  }, []);
}
