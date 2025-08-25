import { Injectable, Logger } from '@nestjs/common';
import { PoolItemDto, PoolsResponseDto } from './dtos/pool.dto';
import { PancakeSwapService } from '@modules/pancakeSwap';
import { formatPancakeSwapPools, formatUniSwapPools } from './formatters';
import { Chains, ChainsService } from 'src/shared/modules/chains';
import { UniSwapService } from '@modules/uniswap';
import { PoolsRepository } from './pools.repository';

@Injectable()
export class PoolsService {
  private readonly logger = new Logger(PoolsService.name);
  constructor(
    private readonly pancakeSwapService: PancakeSwapService,
    private readonly chainsService: ChainsService,
    private readonly uniSwapService: UniSwapService,
    private readonly poolsRepository: PoolsRepository,
  ) {}

  async getPoolsItemsJob(): Promise<PoolsResponseDto> {
    try {
      const [chainsData, pancakeSwapData, uniSwapData] =
        await Promise.allSettled([
          this.chainsService.getChains(),
          this.pancakeSwapService.getPoolsItems(),
          this.uniSwapService.getPoolsItems(),
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
      ];

      return {
        data: poolItems as never as PoolItemDto[],
      };
    } catch (error) {
      console.error('Error fetching pools items:', error);
      return {
        data: [],
      };
    }
  }

  async getPoolsItems(): Promise<PoolsResponseDto> {
    const data = await this.poolsRepository.findAll();

    console.log(
      data.length,
      'getPoolsItemsgetPoolsItemsgetPoolsItemsgetPoolsItems',
    );

    if (!data.length) {
      const poolsData = await this.savePoolItemsInDb();

      console.log(
        poolsData.data.length,
        'savePoolItemsInDbsavePoolItemsInDbsavePoolItemsInDb',
      );

      return {
        data: poolsData.data,
      };
    }

    return { data };
  }

  async savePoolItemsInDb() {
    const poolsData = await this.getPoolsItemsJob();
    await this.poolsRepository.saveMany(poolsData.data);

    return poolsData;
  }
}
