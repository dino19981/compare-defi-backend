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
import { PoolsRepository, PoolsMetaRepository } from './repositories';
import { PoolRequest } from './dtos/poolRequest.dto';
import { CetusService } from '@modules/cetus';
import { RaydiumService } from '@modules/raydium';
import { formatRaydiumPools } from './formatters/formatRaydiumPools';
import { TokensService } from '@shared-modules/tokens';
import { PoolMetaDto } from './dtos/poolMeta.dto';

const DEFAULT_META: PoolMetaDto = {
  platforms: [],
  totalItems: 0,
  tokens: [],
};

@Injectable()
export class PoolsService {
  private readonly logger = new Logger(PoolsService.name);

  constructor(
    private readonly pancakeSwapService: PancakeSwapService,
    private readonly chainsService: ChainsService,
    private readonly tokensService: TokensService,
    private readonly uniSwapService: UniSwapService,
    private readonly poolsRepository: PoolsRepository,
    private readonly cetusService: CetusService,
    private readonly raydiumService: RaydiumService,
    private readonly poolsMetaRepository: PoolsMetaRepository,
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

      const meta = await this.collectMeta(poolItems);

      return {
        data: poolItems as never as PoolItemDto[],
        meta,
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
    const [data, meta] = await Promise.all([
      this.poolsRepository.findBy(query),
      this.poolsMetaRepository.find(),
    ]);

    if (!data.data.length && !Object.keys(query?.filter || {}).length) {
      await this.smartUpdatePoolItemsInDb();
      const finedData = await this.poolsRepository.findBy(query);

      return {
        data: finedData.data,
        meta,
        pagination: {
          total: finedData.total,
        },
      };
    }

    return {
      data: data.data,
      meta,
      pagination: {
        total: data.total,
      },
    };
  }

  async smartUpdatePoolItemsInDb() {
    const poolsData = await this.getPoolsItemsJob();
    await this.poolsRepository.smartUpdate(poolsData.data);

    const meta = await this.collectMeta(poolsData.data);
    await this.poolsMetaRepository.replace(meta);

    return poolsData;
  }

  private async collectMeta(data?: PoolItemDto[]): Promise<PoolMetaDto> {
    if (!data) {
      data = await this.poolsRepository.findAll();
    }

    const meta = data.reduce(
      (acc, item) => {
        acc.platforms.add(item.platform.name);
        acc.tokens[item.firstToken.name] = item.firstToken;
        acc.tokens[item.secondToken.name] = item.secondToken;
        acc.totalItems++;
        return acc;
      },
      {
        platforms: new Set(),
        totalItems: 0,
        tokens: {},
      },
    );

    return {
      ...meta,
      platforms: Array.from(meta.platforms) as string[],
      tokens: Object.values(meta.tokens),
    };
  }
}
