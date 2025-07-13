import {
  EarnItem,
  EarnItemToken,
  EarnItemRate,
  EarnItemPlatform,
} from '../types/EarnItem';
import {
  EarnItemDto,
  EarnItemTokenDto,
  EarnItemRateDto,
  EarnItemPlatformDto,
} from '../dtos/earn.dto';

export class EarnMapper {
  /**
   * Конвертирует внутренний тип EarnItem в DTO для API
   */
  static toDto(earnItem: EarnItem): EarnItemDto {
    return {
      id: earnItem.id,
      token: this.tokenToDto(earnItem.token),
      periodType: earnItem.periodType,
      platform: this.platformToDto(earnItem.platform),
      rates: earnItem.rates.map((rate) => this.rateToDto(rate)),
      productLevel: earnItem.productLevel,
    };
  }

  /**
   * Конвертирует DTO в внутренний тип EarnItem
   */
  static toEntity(dto: EarnItemDto): EarnItem {
    return {
      id: dto.id,
      token: this.tokenToEntity(dto.token),
      periodType: dto.periodType,
      platform: this.platformToEntity(dto.platform),
      rates: dto.rates.map((rate) => this.rateToEntity(rate)),
      productLevel: dto.productLevel,
    };
  }

  private static tokenToDto(token: EarnItemToken): EarnItemTokenDto {
    return {
      name: token.name,
    };
  }

  private static tokenToEntity(dto: EarnItemTokenDto): EarnItemToken {
    return {
      name: dto.name,
    };
  }

  private static rateToDto(rate: EarnItemRate): EarnItemRateDto {
    return {
      rateLevel: rate.rateLevel,
      currentApy: rate.currentApy,
    };
  }

  private static rateToEntity(dto: EarnItemRateDto): EarnItemRate {
    return {
      rateLevel: dto.rateLevel,
      currentApy: dto.currentApy,
    };
  }

  private static platformToDto(
    platform: EarnItemPlatform,
  ): EarnItemPlatformDto {
    return {
      name: platform.name,
      link: platform.link,
    };
  }

  private static platformToEntity(dto: EarnItemPlatformDto): EarnItemPlatform {
    return {
      name: dto.name,
      link: dto.link,
    };
  }
}
