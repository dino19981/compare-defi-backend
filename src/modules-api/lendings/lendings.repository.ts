import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PoolEntity } from './lendings.entity';
import { LendingDto } from './dtos/lendings.dto';
import { LendingRequest } from './dtos/lendingRequest.dto';
import { getSqlRequestForTokensFilter } from './helpers';

@Injectable()
export class LendingsRepository {
  constructor(
    @InjectRepository(PoolEntity)
    private readonly lendingsRepository: Repository<PoolEntity>,
  ) {}

  async findAll(query: LendingRequest): Promise<LendingDto[]> {
    console.log('Получен запрос:', JSON.stringify(query, null, 2));

    const queryBuilder = this.lendingsRepository.createQueryBuilder('pool');

    if (query.filter) {
      this.applyFilters(queryBuilder, query.filter);
    }

    if (query.sort) {
      queryBuilder.orderBy(
        query.sort.field,
        query.sort.direction.toUpperCase() as unknown as 'ASC' | 'DESC',
      );
    }

    // queryBuilder.limit(query.limit);

    const data = await queryBuilder.getMany();

    console.log(data.length, 'data');

    return data.map((item) => this.formatToLendingItem(item));
  }

  async saveMany(data: LendingDto[]): Promise<LendingDto[]> {
    // const entities = data.map((item) => this.formatToEarnEntity(item));

    const savedEntities = this.lendingsRepository.create(data);
    await this.lendingsRepository.save(savedEntities);

    return data;
  }

  // async findByTokenName(tokenName: string): Promise<EarnItemDto[]> {
  //   return this.lendingsRepository
  //     .createQueryBuilder('earn')
  //     .where("earn.token->>'name' = :tokenName", { tokenName })
  //     .orderBy('earn.createdAt', 'DESC')
  //     .getMany() as Promise<EarnItemDto[]>;
  // }

  // async findByPlatformName(platformName: string): Promise<EarnItemDto[]> {
  //   return this.lendingsRepository
  //     .createQueryBuilder('earn')
  //     .where("earn.platform->>'name' = :platformName", { platformName })
  //     .orderBy('earn.createdAt', 'DESC')
  //     .getMany() as Promise<EarnItemDto[]>;
  // }

  // async findByTokenAndPlatform(
  //   tokenName: string,
  //   platformName: string,
  // ): Promise<EarnItemDto[]> {
  //   return this.lendingsRepository
  //     .createQueryBuilder('earn')
  //     .where("earn.token->>'name' = :tokenName", { tokenName })
  //     .andWhere("earn.platform->>'name' = :platformName", { platformName })
  //     .orderBy('earn.createdAt', 'DESC')
  //     .getMany() as Promise<EarnItemDto[]>;
  // }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<PoolEntity>,
    filters: Record<string, any>,
  ): void {
    console.log('Применяем фильтры:', JSON.stringify(filters, null, 2));

    getSqlRequestForTokensFilter(filters, queryBuilder);

    if (filters.chains && filters.chains.length > 0) {
      queryBuilder.andWhere("LOWER(pool.chain->>'name') IN (:...chains)", {
        chains: filters.chains,
      });
    }

    if (filters.platforms && filters.platforms.length > 0) {
      queryBuilder.andWhere("pool.platform->>'name' IN (:...platforms)", {
        platforms: filters.platforms,
      });
    }

    // console.log(queryBuilder.getQueryAndParameters(), 'all filters');
  }

  private formatToLendingItem(item: PoolEntity): LendingDto {
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
