import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ChainDto } from 'src/shared/dtos/chain.dto';
import { PoolItemPlatformDto } from './poolItemPlatformDto.dto';
import { PoolItemBadge, PoolPlatform } from '../types';
import { PoolItemTokenDto } from './poolItemToken.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PoolMetaDto } from './poolMeta.dto';

export class PoolItemDto {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 'pool_001' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Первый токен' })
  @ValidateNested()
  @Type(() => PoolItemTokenDto)
  firstToken: PoolItemTokenDto;

  @ApiProperty({ description: 'Второй токен' })
  @ValidateNested()
  @Type(() => PoolItemTokenDto)
  secondToken: PoolItemTokenDto;

  @ApiProperty({ description: 'Сеть' })
  @ValidateNested()
  @Type(() => ChainDto)
  chain: ChainDto;

  @ApiProperty({ description: 'Платформа' })
  @ValidateNested()
  @Type(() => PoolItemPlatformDto)
  platform: PoolItemPlatformDto;

  @ApiProperty({ description: 'TVL' })
  @IsNumber()
  tvl: number;

  @IsNumber()
  volume: number;

  @ApiProperty({ description: 'Комиссия' })
  @IsNumber()
  fee: number;

  @ApiProperty({ description: 'APR' })
  @IsNumber()
  apr: number;

  @ApiProperty({
    description: 'Бейджи',
    type: [String],
    enum: PoolItemBadge,
    example: [],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(PoolItemBadge, { each: true })
  badges?: PoolItemBadge[];

  @ApiProperty({ description: 'Позиции элемента на странице' })
  @IsObject()
  positions: Record<string, number>;
}

export class PoolsResponseDto {
  @ApiProperty({
    description: 'Список пулов',
    type: [PoolItemDto],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PoolItemDto)
  data: PoolItemDto[];

  @ApiProperty({
    description: 'Мета',
    type: PoolMetaDto,
    example: {
      platforms: [PoolPlatform.PancakeSwap, PoolPlatform.Uniswap],
      tokens: [
        {
          name: 'USDC',
          imageUrl: 'https://example.com/usdc.png',
        },
      ],
      totalItems: 100,
    },
  })
  @ValidateNested()
  @Type(() => PoolMetaDto)
  meta: PoolMetaDto;

  @ApiProperty({
    description: 'Пагинация',
    type: PaginationDto,
    example: {
      totalItems: 100,
    },
  })
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
