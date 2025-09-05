import { Injectable, Logger } from '@nestjs/common';
import { MetaDto, PoolItemDto, PoolsResponseDto } from './dtos/pool.dto';
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

@Injectable()
export class PoolsService {
  private readonly logger = new Logger(PoolsService.name);
  private meta: MetaDto = {
    platforms: [],
  };

  constructor(
    private readonly pancakeSwapService: PancakeSwapService,
    private readonly chainsService: ChainsService,
    private readonly uniSwapService: UniSwapService,
    private readonly poolsRepository: PoolsRepository,
    private readonly cetusService: CetusService,
    private readonly raydiumService: RaydiumService,
  ) {}

  async getPoolsItemsJob(): Promise<PoolsResponseDto> {
    try {
      const [chainsData, pancakeSwapData, uniSwapData, cetusData, raydiumData] =
        await Promise.allSettled([
          this.chainsService.getChains(),
          this.pancakeSwapService.getPoolsItems(),
          this.uniSwapService.getPoolsItems(),
          this.cetusService.getPoolsItems(),
          this.raydiumService.getPoolsItems(),
        ]);

      const { chainById, chainByName } =
        chainsData.status === 'fulfilled' ? chainsData.value : ({} as Chains);

      const poolItems = [
        ...(pancakeSwapData.status === 'fulfilled'
          ? formatPancakeSwapPools(pancakeSwapData.value, chainById)
          : []),
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
      };
    } catch (error) {
      console.error('Error fetching pools items:', error);
      return {
        data: [],
        meta: {
          platforms: [],
        },
      };
    }
  }

  async getPoolsItems(query: PoolRequest): Promise<PoolsResponseDto> {
    const data = await this.poolsRepository.findAll(query);

    if (!data.length && !Object.keys(query?.filter || {}).length) {
      const poolsData = await this.savePoolItemsInDb();

      return poolsData;
    }

    if (!this.meta.platforms.length) {
      await this.collectMeta();
    }

    return { data, meta: this.meta };
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
      data = await this.poolsRepository.findAll({});
    }

    this.meta.platforms = Array.from(
      new Set(data.map((item) => item.platform.name)),
    );
  }
}
