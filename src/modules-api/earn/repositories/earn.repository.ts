import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { EarnEntity, EarnDocument } from '../entities/earn.entity';
import { EarnItemDto, EarnRequest } from '../dtos/earn.dto';

@Injectable()
export class EarnRepository {
  constructor(
    @InjectModel(EarnEntity.name)
    private readonly earnModel: Model<EarnDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async findBy(
    query: EarnRequest,
  ): Promise<{ data: EarnItemDto[]; total: number }> {
    const filter = this.buildMongoFilter(query.filter);
    const sort = this.buildMongoSort(query.sort);

    const [data, total] = await Promise.all([
      this.earnModel.find(filter).sort(sort).limit(query.limit).lean().exec(),
      this.earnModel.countDocuments(filter),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      data: data.map((item) => this.formatToEarnItem(item)),
      total,
    };
  }

  async findAll(): Promise<EarnItemDto[]> {
    const data = await this.earnModel.find().exec();

    return data;
  }

  async replaceMany(data: EarnItemDto[]): Promise<EarnItemDto[]> {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.earnModel.deleteMany({}, { session });
        await this.earnModel.insertMany(data, { session });
      });

      return data;
    } finally {
      await session.endSession();
    }
  }

  async saveMany(data: EarnItemDto[]): Promise<EarnItemDto[]> {
    await this.earnModel.insertMany(data);
    return data;
  }

  private buildMongoFilter(filters: Record<string, any> | undefined): any {
    if (!filters) return {};

    const mongoFilter: any = {};

    if (filters.tokenName && filters.tokenName.length > 0) {
      mongoFilter['token.name'] = { $in: filters.tokenName };
    }

    if (filters.platformName && filters.platformName.length > 0) {
      mongoFilter['platform.name'] = { $in: filters.platformName };
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

  private formatToEarnItem(item: EarnDocument): EarnItemDto {
    return {
      id: item._id.toString(),
      name: item.name,
      periodType: item.periodType,
      token: {
        name: item.token.name,
        icon: item.token.icon,
      },
      platform: {
        name: item.platform.name,
        link: item.platform.link,
        refLink: item.platform.refLink,
      },
      productLevel: item.productLevel,

      maxRate: item.maxRate,
      ...(item?.rateSettings && {
        rateSettings: item.rateSettings.map((setting) => ({
          min: setting.min,
          max: setting.max,
          apy: setting.apy,
        })),
      }),
      duration: item.duration,
      ...(item.badges && {
        badges: [...item.badges],
      }),
    };
  }
}
