import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EarnEntity } from './earn.entity';
import { EarnPlatform } from './types';
import { EarnItemDto, EarnRequest } from './dtos/earn.dto';
import { AvailableTokensForEarn } from './helpers';

@Injectable()
export class EarnRepository {
  constructor(
    @InjectRepository(EarnEntity)
    private readonly earnRepository: Repository<EarnEntity>,
  ) {}

  async findAll(query: EarnRequest): Promise<EarnItemDto[]> {
    const data = await this.earnRepository.find({
      ...(query.filter && {
        where: query.filter,
      }),
      ...(query.sort && {
        order: {
          [query.sort?.field as keyof EarnItemDto]: query.sort?.direction,
        },
      }),
    });

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
    const entities = data.map((item) => this.formatToEarnEntity(item));

    const savedEntities = this.earnRepository.create(entities);
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

  private formatToEarnItem(item: EarnEntity): EarnItemDto {
    return {
      id: item.id,
      name: item.name,
      periodType: item.periodType,
      token: {
        name: item.tokenName as AvailableTokensForEarn,
      },
      platform: {
        name: item.platformName as EarnPlatform,
        link: item.platformLink,
        refLink: item.platformRefLink,
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

  private formatToEarnEntity(item: EarnItemDto): EarnEntity {
    return {
      id: item.id,
      name: item.name,
      periodType: item.periodType,
      tokenName: item.token.name,
      platformName: item.platform.name,
      platformLink: item.platform.link,
      platformRefLink: item.platform.refLink,

      productLevel: item.productLevel,

      maxRate: item.maxRate,
      ...(item?.rateSettings && {
        rateSettings: item.rateSettings,
      }),
      duration: item.duration,
      ...(item.badges && {
        badges: item.badges,
      }),
    };
  }
}
