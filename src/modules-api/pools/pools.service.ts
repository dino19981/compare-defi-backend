import { Injectable, Logger } from '@nestjs/common';
import { PoolItemDto, PoolsResponseDto } from './dtos/pool.dto';
import { PancakeSwapService } from '@modules/pancakeSwap';
import {
  formatCetusPools,
  formatPancakeSwapPools,
  formatUniSwapPools,
} from './formatters';
import { Chains, ChainsService } from 'src/shared/modules/chains';
import { UniSwapService } from '@modules/uniswap';
import { PoolsRepository } from './pools.repository';
import { PoolRequest } from './dtos/poolRequest.dto';
import { CetusService } from '@modules/cetus';
import { RaydiumService } from '@modules/raydium';
import { formatRaydiumPools } from './formatters/formatRaydiumPools';
import { TokensService } from '@shared-modules/tokens';
import { PoolPlatform } from './types';
import { MetaDto } from 'src/shared/dtos/meta.dto';

const DEFAULT_META: MetaDto = {
  platforms: [],
  totalItems: 0,
};

@Injectable()
export class PoolsService {
  private readonly logger = new Logger(PoolsService.name);
  private meta: MetaDto = DEFAULT_META;

  constructor(
    private readonly pancakeSwapService: PancakeSwapService,
    private readonly chainsService: ChainsService,
    private readonly tokensService: TokensService,
    private readonly uniSwapService: UniSwapService,
    private readonly poolsRepository: PoolsRepository,
    private readonly cetusService: CetusService,
    private readonly raydiumService: RaydiumService,
  ) {}

  async getPoolsItemsJob(): Promise<PoolsResponseDto> {
    try {
      const [
        chainsData,
        pancakeSwapData,
        pancakeSwapTokens,
        pancakeSwapPoolsItemsConfig,
        uniSwapData,
        cetusData,
        raydiumData,
      ] = await Promise.allSettled([
        this.chainsService.getChains(),
        this.pancakeSwapService.getPoolsItems(),
        this.pancakeSwapService.getTokens(),
        this.pancakeSwapService.getPoolsItemsConfig(),
        this.uniSwapService.getPoolsItems(),
        this.cetusService.getPoolsItems(),
        this.raydiumService.getPoolsItems(),
      ]);

      const { chainById, chainByName } =
        chainsData.status === 'fulfilled' ? chainsData.value : ({} as Chains);

      const pancakeSwapTokensData =
        pancakeSwapTokens.status === 'fulfilled' ? pancakeSwapTokens.value : [];
      const pancakeSwapPoolsItemsConfigData =
        pancakeSwapPoolsItemsConfig.status === 'fulfilled'
          ? pancakeSwapPoolsItemsConfig.value
          : {};

      const pancakeSwapPools =
        pancakeSwapData.status === 'fulfilled'
          ? await formatPancakeSwapPools(
              pancakeSwapData.value,
              chainById,
              pancakeSwapTokensData,
              pancakeSwapPoolsItemsConfigData,
            )
          : [];

      const poolItems = [
        ...pancakeSwapPools,
        ...(uniSwapData.status === 'fulfilled'
          ? formatUniSwapPools(uniSwapData.value, chainByName)
          : []),
        ...(cetusData.status === 'fulfilled'
          ? formatCetusPools(cetusData.value, chainByName)
          : []),
        ...(raydiumData.status === 'fulfilled'
          ? formatRaydiumPools(raydiumData.value, chainByName)
          : []),
      ];

      return {
        data: poolItems as never as PoolItemDto[],
        meta: this.meta,
        pagination: {
          total: poolItems.length,
        },
      };
    } catch (error) {
      console.error('Error fetching pools items:', error);
      return {
        data: [],
        meta: DEFAULT_META,
        pagination: {
          total: 0,
        },
      };
    }
  }

  async testTokens() {
    await this.tokensService.saveTokens();
  }

  async getPoolsItems(query: PoolRequest): Promise<PoolsResponseDto> {
    const data = await this.poolsRepository.findBy(query);

    if (!data.data.length && !Object.keys(query?.filter || {}).length) {
      await this.savePoolItemsInDb();
      const finedData = await this.poolsRepository.findBy(query);

      return {
        data: finedData.data,
        meta: this.meta,
        pagination: {
          total: finedData.total,
        },
      };
    }

    if (!this.meta.platforms.length) {
      await this.collectMeta();
    }

    return {
      data: data.data,
      meta: this.meta,
      pagination: {
        total: data.total,
      },
    };
  }

  async savePoolItemsInDb() {
    const poolsData = await this.getPoolsItemsJob();
    await this.poolsRepository.saveMany(poolsData.data);

    await this.collectMeta(poolsData.data);

    return {
      data: poolsData.data,
      meta: this.meta,
    };
  }

  private async collectMeta(data?: PoolItemDto[]) {
    if (!data) {
      data = await this.poolsRepository.findAll();
    }

    const meta = data.reduce(
      (acc, item) => {
        acc.platforms.add(item.platform.name);
        acc.totalItems++;
        return acc;
      },
      {
        platforms: new Set(),
        totalItems: 0,
      },
    );

    this.meta = {
      ...meta,
      platforms: Array.from(meta.platforms) as PoolPlatform[],
    };
  }
}
