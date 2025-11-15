import { Injectable, Logger } from '@nestjs/common';
import { LendingDto, LendingResponseDto } from './dtos/lendings.dto';
import { LendingRequest } from './dtos/lendingRequest.dto';
import { LendingsRepository } from './lendings.repository';
import { AaveClient } from '@aave/client';
import { AaveService } from '@modules/aave';
import { formatAave } from './formatters';
import { MetaDto } from 'src/shared/dtos/meta.dto';

export const client = AaveClient.create();

const DEFAULT_META: MetaDto = {
  platforms: [],
  totalItems: 0,
};

@Injectable()
export class LendingsService {
  private readonly logger = new Logger(LendingsService.name);
  private meta: MetaDto = DEFAULT_META;

  constructor(
    private readonly lendingsRepository: LendingsRepository,
    private readonly aaveService: AaveService,
  ) {}

  async getLendingItemsJob(): Promise<LendingResponseDto> {
    try {
      const [aaveData] = await Promise.allSettled([
        this.aaveService.getLendingItems(),
      ]);

      const data = [
        ...(aaveData.status === 'fulfilled' ? formatAave(aaveData.value) : []),
      ];

      // const { chainById, chainByName } =
      //   chainsData.status === 'fulfilled' ? chainsData.value : ({} as Chains);

      return {
        data: data as never as LendingDto[],
        meta: this.meta,
      };
    } catch (error) {
      console.error('Error fetching lending items:', error);

      return {
        data: [],
        meta: DEFAULT_META,
      };
    }
  }

  async getLendingItems(query: LendingRequest): Promise<LendingResponseDto> {
    const data = await this.lendingsRepository.findAll(query);

    if (!data.length && !Object.keys(query?.filter || {}).length) {
      const lendingData = await this.saveLendingItemsInDb();

      return lendingData;
    }

    if (!this.meta.platforms.length) {
      await this.collectMeta();
    }

    return { data, meta: this.meta };
  }

  async saveLendingItemsInDb() {
    const lendingData = await this.getLendingItemsJob();
    await this.lendingsRepository.saveMany(lendingData.data);

    await this.collectMeta(lendingData.data);

    return {
      data: lendingData.data,
      meta: this.meta,
    };
  }

  private async collectMeta(data?: LendingDto[]) {
    if (!data) {
      data = await this.lendingsRepository.findAll({});
    }

    this.meta.platforms = Array.from(
      new Set(data.map((item) => item.platform.name)),
    );
  }
}
// Остановился на том что не понимаю откуда брать название токенов для borrow
const qwe = {
  supplyAssets: 255081143002,
  supplyAssetsUsd: 255034.00655758465,
  market: {
    uniqueKey:
      '0x7a7018e22a8bb2d08112eae9391e09f065a8ae7ae502c1c23dc96c21411a6efd',
    state: {
      borrowAssetsUsd: 190357.20965383353,
      supplyAssetsUsd: 255035.5057524972,
      borrowShares: '181478742781244260',
      supplyShares: '244383003915840763',
      liquidityAssets: 64690250210,
      liquidityAssetsUsd: 64677.76499170947,
      collateralAssets: '350695909545624878206872',
      collateralAssetsUsd: 561113.4552729998,
      utilization: 0.7463949346667376,
      rateAtUTarget: 0.10666316551922973,
      apyAtTarget: 0.10666316551922973,
      rateAtTarget: 3213766190,
      supplyApy: 0.06908586406337454,
      borrowApy: 0.09256021087046339,
      netSupplyApy: 0.074817780860253,
      netBorrowApy: 0.09256021087046339,
      fee: 0,
      price: '1598118830000000000000000',
      dailyPriceVariation: -0.03135978918137581,
      timestamp: 1757869200,
      size: 911691388147,
      sizeUsd: 911515.4317090876,
      totalLiquidity: 721298995883,
      totalLiquidityUsd: 721159.7851767945,
      avgSupplyApy: 0.06772273397546025,
      avgNetSupplyApy: 0.0734546507723387,
      avgBorrowApy: 0.09196948667975668,
      avgNetBorrowApy: 0.09196948667975668,
      dailySupplyApy: 0.07290612566331145,
      dailyNetSupplyApy: 0.0786380424601899,
      dailyBorrowApy: 0.0955238383753858,
      dailyNetBorrowApy: 0.0955238383753858,
      weeklySupplyApy: 0.08604045432754392,
      weeklyNetSupplyApy: 0.09177237112442238,
      weeklyBorrowApy: 0.10541339660854465,
      weeklyNetBorrowApy: 0.10541339660854465,
      biweeklySupplyApy: 0.08611508388932387,
      biweeklyNetSupplyApy: 0.09184700068620233,
      biweeklyBorrowApy: 0.10835883629228715,
      biweeklyNetBorrowApy: 0.10835883629228715,
      monthlySupplyApy: 0.11532185377453286,
      monthlyNetSupplyApy: 0.12105377057141131,
      monthlyBorrowApy: 0.1386867076327789,
      monthlyNetBorrowApy: 0.1386867076327789,
      quarterlySupplyApy: 0.1340317035986638,
      quarterlyNetSupplyApy: 0.13976362039554224,
      quarterlyBorrowApy: 0.15398582670095573,
      quarterlyNetBorrowApy: 0.15398582670095573,
      yearlySupplyApy: 0.06908586406337454,
      yearlyNetSupplyApy: 0.074817780860253,
      yearlyBorrowApy: 0.09256021087046339,
      yearlyNetBorrowApy: 0.09256021087046339,
      allTimeSupplyApy: 0.06908586406337454,
      allTimeNetSupplyApy: 0.074817780860253,
      allTimeBorrowApy: 0.09256021087046339,
      allTimeNetBorrowApy: 0.09256021087046339,
      supplyAssets: 255082642474,
    },
  },
};

// total deposits - Это общая сумма средств, которую пользователи внесли в этот vault
// liquidity - это часть из “Total Deposits”, которая в настоящий момент свободна, то есть свободна для снятия или выдачи в займ. То есть средства, которые не заняты займами или другими обязательствами.
interface MorphoLandingSupplyItemDto {
  asset: {
    symbol: string;
    logoURI: string;
  };

  // адрес vault
  // https://app.morpho.org/<chain.network>/vault/<address>/smokehouse-usdc
  address: string;

  symbol: string;
  // название vault
  name: string;

  state: {
    // apy
    dailyNetApy: number;
    weeklyNetApy: number;
    monthlyNetApy: number;

    // deposits
    totalAssetsUsd: number;
  };

  chain: {
    network: string;
    // ETH
    currency: string;
  };

  // ликвидность
  liquidity: {
    underlying: string;
    // ликвидность
    usd: number;
  };
}

// example https://app.morpho.org/ethereum/market/0x7a7018e22a8bb2d08112eae9391e09f065a8ae7ae502c1c23dc96c21411a6efd/eigen-usdc
interface MorphoLandingBorrowItemDto {
  market: {
    // id странички
    uniqueKey: string;

    loanAsset: {
      name: string;
      symbol: string;
      chain: {
        network: string;
        currency: string;
      };
      logoURI: string;
    };
    collateralAsset: {
      name: string;
      symbol: string;
      chain: {
        network: string;
        currency: string;
      };
      logoURI: string;
    };

    state: {
      // Total Market Size
      sizeUsd: number;

      // Total Liquidity
      totalLiquidityUsd: number;

      avgNetBorrowApy: number;
      weeklyNetBorrowApy: number;
      monthlyNetBorrowApy: number;
    };
  };
}

interface MorphoLandingsSupplyDto {
  data: {
    vaults: {
      items: (MorphoLandingSupplyItemDto | MorphoLandingBorrowItemDto)[];
    };
  };
}
