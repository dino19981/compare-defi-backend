import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { EarnItemLevel } from '../types/EarnItem';

export class EarnItemTokenDto {
  @ApiProperty({ description: 'Название токена', example: 'BTC' })
  @IsString()
  name: string;
}

export class EarnItemRateDto {
  @ApiProperty({ description: 'Уровень ставки', example: 1 })
  @IsNumber()
  rateLevel: number;

  @ApiProperty({ description: 'Текущий APY', example: 5.5 })
  @IsNumber()
  currentApy: number;
}

export class EarnItemPlatformDto {
  @ApiProperty({ description: 'Название платформы', example: 'Binance' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ссылка на платформу',
    example: 'https://binance.com',
  })
  @IsUrl()
  link: string;
}

export class EarnItemDto {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 'earn_001' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Информация о токене' })
  @ValidateNested()
  @Type(() => EarnItemTokenDto)
  token: EarnItemTokenDto;

  @ApiProperty({
    description: 'Тип периода',
    enum: ['flexible', 'fixed'],
    example: 'flexible',
  })
  @IsEnum(['flexible', 'fixed'])
  periodType: 'flexible' | 'fixed';

  @ApiProperty({ description: 'Информация о платформе' })
  @ValidateNested()
  @Type(() => EarnItemPlatformDto)
  platform: EarnItemPlatformDto;

  @ApiProperty({ description: 'Массив ставок', type: [EarnItemRateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EarnItemRateDto)
  rates: EarnItemRateDto[];

  @ApiProperty({
    description: 'Уровень продукта',
    enum: EarnItemLevel,
    example: EarnItemLevel.Normal,
  })
  @IsEnum(EarnItemLevel)
  productLevel: EarnItemLevel;
}

export class EarnResponseDto {
  @ApiProperty({
    description: 'Массив элементов earn',
    type: [EarnItemDto],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EarnItemDto)
  data: EarnItemDto[];
}
