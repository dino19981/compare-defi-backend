import { Injectable, Logger } from '@nestjs/common';
import { MetaDto, PoolItemDto, PoolsResponseDto } from './dtos/lendings.dto';
import { Chains, ChainsService } from 'src/shared/modules/chains';
import { PoolRequest } from './dtos/lendingRequest.dto';
import { LandingsRepository } from './lendings.repository';

@Injectable()
export class LendingsService {
  private readonly logger = new Logger(LendingsService.name);
  private meta: MetaDto = {
    platforms: [],
  };

  constructor(
    private readonly chainsService: ChainsService,
    private readonly landingsRepository: LandingsRepository,
  ) {}

  async getLandingsItemsJob(): Promise<PoolsResponseDto> {
    try {
      const [chainsData] = await Promise.allSettled([
        this.chainsService.getChains(),
      ]);

      const { chainById, chainByName } =
        chainsData.status === 'fulfilled' ? chainsData.value : ({} as Chains);

      const poolItems = [];

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

  async getLandingsItems(query: PoolRequest): Promise<PoolsResponseDto> {
    const data = await this.landingsRepository.findAll(query);

    if (!data.length && !Object.keys(query?.filter || {}).length) {
      const poolsData = await this.saveLandingsItemsInDb();

      return poolsData;
    }

    if (!this.meta.platforms.length) {
      await this.collectMeta();
    }

    return { data, meta: this.meta };
  }

  async saveLandingsItemsInDb() {
    const poolsData = await this.getLandingsItemsJob();
    await this.landingsRepository.saveMany(poolsData.data);

    this.collectMeta(poolsData.data);

    return {
      data: poolsData.data,
      meta: this.meta,
    };
  }

  private async collectMeta(data?: PoolItemDto[]) {
    if (!data) {
      data = await this.landingsRepository.findAll({});
    }

    this.meta.platforms = Array.from(
      new Set(data.map((item) => item.platform.name)),
    );
  }
}
