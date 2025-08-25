import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoolEntity } from './pools.entity';
import { PoolItemDto } from './dtos/pool.dto';

@Injectable()
export class PoolsRepository {
  constructor(
    @InjectRepository(PoolEntity)
    private readonly earnRepository: Repository<PoolEntity>,
  ) {}

  async findAll(): Promise<PoolItemDto[]> {
    const data = await this.earnRepository.find();

    return data.map((item) => this.formatToPoolItem(item));
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

  async saveMany(data: PoolItemDto[]): Promise<PoolItemDto[]> {
    // const entities = data.map((item) => this.formatToEarnEntity(item));

    const savedEntities = this.earnRepository.create(data);
    await this.earnRepository.save(savedEntities);

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

  private formatToPoolItem(item: PoolEntity): PoolItemDto {
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
