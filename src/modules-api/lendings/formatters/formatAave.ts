import { Lending, LendingPlatformName } from '../types';
import { AaveMarket } from '@modules/aave/types/Aave.dto';
import { buildLendingItemKey } from '../helpers';

const marketNameByName = {
  AaveV3EthereumEtherFi: 'proto_etherfi_v3',
  AaveV3EthereumLido: 'proto_lido_v3',
  AaveV3Ethereum: 'proto_mainnet_v3',
  AaveV3EthereumHorizon: 'proto_horizon_v3',
  AaveV3Base: 'proto_base_v3',
  AaveV3Arbitrum: 'proto_arbitrum_v3',
  AaveV3Avalanche: 'proto_avalanche_v3',
  AaveV3Sonic: 'proto_sonic_v3',
  AaveV3Optimism: 'proto_optimism_v3',
  AaveV3Polygon: 'proto_polygon_v3',
  AaveV3Metis: 'proto_metis_v3',
  AaveV3Gnosis: 'proto_gnosis_v3',
  AaveV3Celo: 'proto_celo_v3',
  AaveV3BNB: 'proto_bnb_v3',
  AaveV3Scroll: 'proto_scroll_v3',
  AaveV3ZkSync: 'proto_zksync_v3',
  AaveV3Soneium: 'proto_soneium_v3',
  AaveV3Linea: 'proto_linea_v3',
};

export function formatAave(items: AaveMarket[]): Lending[] {
  return items.reduce((acc: Lending[], item) => {
    item.supplyReserves.forEach((reserve) => {
      if (reserve.isFrozen || reserve.isPaused) {
        return;
      }

      acc.push({
        id: buildLendingItemKey(
          LendingPlatformName.Aave,
          item.chain.name,
          reserve.underlyingToken.symbol,
        ),

        token: {
          name: reserve.underlyingToken.symbol,
          imageUrl: reserve.underlyingToken.imageUrl,
        },
        chain: {
          name: item.chain.name,
          imageUrl: item.chain.icon,
        },
        platform: {
          name: LendingPlatformName.Aave,
          link: `https://app.aave.com/reserve-overview/?underlyingAsset=${reserve.underlyingToken.address.toLocaleLowerCase()}&marketName=${marketNameByName[item.name]}`,
        },

        totalSupplied: +reserve.size.usd,
        supplyAPY: +reserve.supplyInfo.apy.formatted,

        totalBorrowed: +(reserve?.borrowInfo?.total?.usd || 0),
        borrowAPY: +(reserve?.borrowInfo?.apy?.formatted || 0),

        badges: [],
      });
    });

    return acc;
  }, []);
}
