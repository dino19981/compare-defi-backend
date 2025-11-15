import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from 'mongoose';
import { PoolEntity, PoolDocument } from './pools.entity';
import { PoolItemDto } from './dtos/pool.dto';
import { PoolRequest } from './dtos/poolRequest.dto';

@Injectable()
export class PoolsRepository {
  constructor(
    @InjectModel(PoolEntity.name)
    private readonly poolsModel: Model<PoolDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async findBy(
    query: PoolRequest,
  ): Promise<{ data: PoolItemDto[]; total: number }> {
    console.log('Получен запрос:', JSON.stringify(query, null, 2));

    const filter = this.buildMongoFilter(query.filter);
    const sort = this.buildMongoSort(query.sort);

    const [data, total] = await Promise.all([
      this.poolsModel.find(filter).sort(sort).limit(query.limit).exec(),
      this.poolsModel.countDocuments(filter),
    ]);

    return {
      data: data.map((item) => this.formatToPoolItem(item)),
      total,
    };
  }

  async findAll(): Promise<PoolItemDto[]> {
    const data = await this.poolsModel.find().exec();

    return data;
  }

  async replaceMany(data: PoolItemDto[]): Promise<PoolItemDto[]> {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.poolsModel.deleteMany({}, { session });
        await this.poolsModel.insertMany(data, { session });
      });

      return data;
    } finally {
      await session.endSession();
    }
  }

  async saveMany(data: PoolItemDto[]): Promise<PoolItemDto[]> {
    await this.poolsModel.insertMany(data);
    return data;
  }

  private buildMongoFilter(filters: Record<string, any> | undefined): any {
    if (!filters) return {};

    const { firstTokens: _firstTokens = [], secondTokens: _secondTokens = [] } =
      filters;

    const mongoFilter: any = {};

    const hasFirstTokens = _firstTokens && _firstTokens.length > 0;
    const hasSecondTokens = _secondTokens && _secondTokens.length > 0;

    const firstTokens = _firstTokens.map((token: string) =>
      token.toUpperCase(),
    );
    const secondTokens = _secondTokens.map((token: string) =>
      token.toUpperCase(),
    );

    // Фильтр по токенам
    if (hasFirstTokens && !hasSecondTokens) {
      console.log('add first token');

      // Создаем регулярные выражения для поиска по частичному вхождению
      const firstTokenRegexes = firstTokens.map((token) => ({
        'firstToken.name': {
          $regex: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      }));

      const secondTokenRegexes = firstTokens.map((token) => ({
        'secondToken.name': {
          $regex: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      }));

      mongoFilter.$or = [...firstTokenRegexes, ...secondTokenRegexes];
    }

    if (hasFirstTokens && hasSecondTokens) {
      const firstTokenRegexes = firstTokens.map((token) => ({
        'firstToken.name': {
          $regex: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      }));

      const secondTokenRegexes = secondTokens.map((token) => ({
        'secondToken.name': {
          $regex: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      }));

      const firstTokenRegexes2 = firstTokens.map((token) => ({
        'secondToken.name': {
          $regex: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      }));

      const secondTokenRegexes2 = secondTokens.map((token) => ({
        'firstToken.name': {
          $regex: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        },
      }));

      mongoFilter.$or = [
        {
          $and: [
            {
              $or: firstTokenRegexes,
            },
            {
              $or: secondTokenRegexes,
            },
          ],
        },
        {
          $and: [
            {
              $or: secondTokenRegexes2,
            },
            {
              $or: firstTokenRegexes2,
            },
          ],
        },
      ];
    }

    // Фильтр по сетям
    if (filters.chains && filters.chains.length > 0) {
      mongoFilter['chain.name'] = {
        $in: filters.chains.map(
          (chain: string) =>
            new RegExp(chain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        ),
      };
    }

    // Фильтр по платформам
    if (filters.platforms && filters.platforms.length > 0) {
      mongoFilter['platform.name'] = {
        $in: filters.platforms.map(
          (platform: string) =>
            new RegExp(platform.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        ),
      };
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
