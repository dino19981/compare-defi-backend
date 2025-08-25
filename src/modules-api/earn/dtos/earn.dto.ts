import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { EarnItemLevel, EarnItemRateSettings } from '../types/EarnItem';
import { EarnItemTokenDto } from './EarnItemToken.dto';
import { EarnItemPlatformDto } from './EarnItemPlatform.dto';
import { EarnItemRateSettingsDto } from './EarnItemRateSettings.dto';
import { EarnItemBadge } from '../types/EarnItem';
import { EarnSort } from './EarnSort.dto';

export class EarnItemDto {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 'earn_001' })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Название продукта',
    example: 'Simple Earn',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({
    description: 'Уровень продукта',
    enum: EarnItemLevel,
    example: EarnItemLevel.Normal,
  })
  @IsEnum(EarnItemLevel)
  productLevel: EarnItemLevel;

  @ApiProperty({
    description: 'Максимальная ставка',
    example: 100,
  })
  @IsNumber()
  maxRate: number;

  @ApiProperty({
    description: 'Настройки ставки',
    type: [EarnItemRateSettingsDto],
    example: [],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EarnItemRateSettingsDto)
  rateSettings?: EarnItemRateSettings[];

  @ApiProperty({
    description: 'Длительность стейкинга',
    example: 100,
    oneOf: [{ type: 'number' }, { type: 'string', enum: ['Infinity'] }],
  })
  duration: number | 'Infinity';

  @ApiProperty({
    description: 'Бейджи',
    type: [String],
    enum: EarnItemBadge,
    example: [],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(EarnItemBadge, { each: true })
  badges?: EarnItemBadge[];
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

export class EarnRequest {
  @ApiProperty({ description: 'Сортировка', nullable: true })
  @ValidateNested()
  @Type(() => EarnSort)
  sort?: EarnSort;

  @ApiProperty({ description: 'Фильтрация', nullable: true })
  // @ValidateNested()
  // @Type(() => ({}))
  filter?: Record<string, any>;
}
