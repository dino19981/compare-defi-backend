import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EarnEntity, EarnDocument } from './earn.entity';
import { EarnItemDto, EarnRequest } from './dtos/earn.dto';

@Injectable()
export class EarnRepository {
  constructor(
    @InjectModel(EarnEntity.name)
    private readonly earnModel: Model<EarnDocument>,
  ) {}

  async findAll(query: EarnRequest): Promise<EarnItemDto[]> {
    const filter = this.buildMongoFilter(query.filter);
    const sort = this.buildMongoSort(query.sort);

    const data = await this.earnModel.find(filter).sort(sort).lean().exec();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.map((item) => this.formatToEarnItem(item));
  }

  // async findByPlatform(platform: string): Promise<EarnEntity[]> {
  //   return this.earnRepository.find({
  //     where: { platform, isActive: true },
  //     order: { rate: 'DESC' },
  //   });
  // }

  // async findByToken(token: string): Promise<EarnEntity[]> {
  //   return this.earnRepository.find({
  //     where: { token, isActive: true },
  //     order: { rate: 'DESC' },
  //   });
  // }

  async saveMany(data: EarnItemDto[]): Promise<EarnItemDto[]> {
    await this.earnModel.insertMany(data);
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
      mongoFilter.tokenName = { $in: filters.tokens };
    }

    // Фильтр по платформам
    if (filters.platforms && filters.platforms.length > 0) {
      mongoFilter.platformName = { $in: filters.platforms };
    }

    // Фильтр по типу периода
    if (filters.periodType) {
      mongoFilter.periodType = filters.periodType;
    }

    // Фильтр по уровню продукта
    if (filters.productLevel) {
      mongoFilter.productLevel = filters.productLevel;
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
      id: item.id,
      name: item.name,
      periodType: item.periodType,
      token: {
        name: item.token.name,
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
