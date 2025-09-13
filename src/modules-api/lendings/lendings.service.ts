import { Injectable, Logger } from '@nestjs/common';
import { MetaDto, LendingDto, LendingResponseDto } from './dtos/lendings.dto';
import { LendingRequest } from './dtos/lendingRequest.dto';
import { LendingsRepository } from './lendings.repository';
import { AaveClient } from '@aave/client';
import { AaveService } from '@modules/aave';
import { formatAave } from './formatters';

export const client = AaveClient.create();

@Injectable()
export class LendingsService {
  private readonly logger = new Logger(LendingsService.name);
  private meta: MetaDto = {
    platforms: [],
  };

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
        meta: {
          platforms: [],
        },
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
