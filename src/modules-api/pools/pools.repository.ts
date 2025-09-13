import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PoolEntity, PoolDocument } from './pools.entity';
import { PoolItemDto } from './dtos/pool.dto';
import { PoolRequest } from './dtos/poolRequest.dto';

@Injectable()
export class PoolsRepository {
  constructor(
    @InjectModel(PoolEntity.name)
    private readonly poolsModel: Model<PoolDocument>,
  ) {}

  async findAll(query: PoolRequest): Promise<PoolItemDto[]> {
    console.log('Получен запрос:', JSON.stringify(query, null, 2));

    const filter = this.buildMongoFilter(query.filter);
    const sort = this.buildMongoSort(query.sort);

    const data = await this.poolsModel.find(filter).sort(sort).exec();

    console.log(data.length, 'data');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.map((item) => this.formatToPoolItem(item));
  }

  async saveMany(data: PoolItemDto[]): Promise<PoolItemDto[]> {
    await this.poolsModel.insertMany(data);
    return data;
  }

  // async findByTokenName(tokenName: string): Promise<EarnItemDto[]> {
  //   return this.earnRepository
  //     .createQueryBuilder('earn')
  //     .where("earn.token->>'name' = :tokenName", { tokenName })
  //     .orderBy('earn.createdAt', 'DESC')
  //     .getMany() as Promise<EarnItemDto[]>;
  // }

  // async findByPlatformName(platformName: string): Promise<EarnItemDto[]> {
  //   return this.earnRepository
  //     .createQueryBuilder('earn')
  //     .where("earn.platform->>'name' = :platformName", { platformName })
  //     .orderBy('earn.createdAt', 'DESC')
  //     .getMany() as Promise<EarnItemDto[]>;
  // }

  // async findByTokenAndPlatform(
  //   tokenName: string,
  //   platformName: string,
  // ): Promise<EarnItemDto[]> {
  //   return this.earnRepository
  //     .createQueryBuilder('earn')
  //     .where("earn.token->>'name' = :tokenName", { tokenName })
  //     .andWhere("earn.platform->>'name' = :platformName", { platformName })
  //     .orderBy('earn.createdAt', 'DESC')
  //     .getMany() as Promise<EarnItemDto[]>;
  // }

  private buildMongoFilter(filters: Record<string, any> | undefined): any {
    if (!filters) return {};

    const mongoFilter: any = {};

    // Фильтр по токенам
    if (filters.tokens && filters.tokens.length > 0) {
      mongoFilter.$or = [
        { 'firstToken.name': { $in: filters.tokens } },
        { 'secondToken.name': { $in: filters.tokens } },
      ];
    }

    // Фильтр по сетям
    if (filters.chains && filters.chains.length > 0) {
      mongoFilter['chain.name'] = { $in: filters.chains };
    }

    // Фильтр по платформам
    if (filters.platforms && filters.platforms.length > 0) {
      mongoFilter['platform.name'] = { $in: filters.platforms };
    }

    return mongoFilter;
  }

  private buildMongoSort(
    sort: { field: string; direction: string } | undefined,
  ): any {
    if (!sort) return {};

    const direction = sort.direction.toUpperCase() === 'ASC' ? 1 : -1;
    return { [sort.field]: direction };
  }

  private formatToPoolItem(item: PoolDocument): PoolItemDto {
    return {
      id: item.id,
      firstToken: {
        name: item.firstToken.name,
        imageUrl: item.firstToken.imageUrl,
      },
      secondToken: {
        name: item.secondToken.name,
        imageUrl: item.secondToken.imageUrl,
      },
      chain: {
        name: item.chain.name,
        imageUrl: item.chain.imageUrl,
      },
      platform: {
        name: item.platform.name,
        link: item.platform.link,
        refLink: item.platform.refLink,
      },
      tvl: item.tvl,
      volume: item.volume,
      fee: item.fee,
      apr: item.apr,
      ...(item.badges && {
        badges: [...item.badges],
      }),
    };
  }

  // private formatToEarnEntity(item: EarnItemDto): EarnEntity {
  //   return {
  //     id: item.id,
  //     name: item.name,
  //     periodType: item.periodType,
  //     tokenName: item.token.name,
  //     platformName: item.platform.name,
  //     platformLink: item.platform.link,
  //     platformRefLink: item.platform.refLink,

  //     productLevel: item.productLevel,

  //     maxRate: item.maxRate,
  //     ...(item?.rateSettings && {
  //       rateSettings: item.rateSettings,
  //     }),
  //     duration: item.duration,
  //     ...(item.badges && {
  //       badges: item.badges,
  //     }),
  //   };
  // }
}
