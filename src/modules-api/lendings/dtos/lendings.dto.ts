import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { LendingPlatformDto } from './lendingPlatformDto.dto';
import { PoolItemBadge, LendingPlatform } from '../types';
import { PoolItemTokenDto } from './lendingToken.dto';
import { ChainDto } from 'src/shared/dtos/chain.dto';

export class LendingDto {
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
  @Type(() => LendingPlatformDto)
  platform: LendingPlatformDto;

  @ApiProperty({ description: 'TVL' })
  @IsNumber()
  tvl: string;

  @IsNumber()
  volume: string;

  @ApiProperty({ description: 'Комиссия' })
  @IsNumber()
  fee: string;

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
}

export class MetaDto {
  @ApiProperty({
    description: 'Платформы',
    type: [String],
    enum: LendingPlatform,
    example: [],
  })
  platforms: LendingPlatform[];
}

export class LendingResponseDto {
  @ApiProperty({
    description: 'Список лендингов',
    type: [LendingDto],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LendingDto)
  data: LendingDto[];

  @ApiProperty({
    description: 'Мета',
    type: MetaDto,
    example: {
      platforms: [LendingPlatform.PancakeSwap, LendingPlatform.Uniswap],
    },
  })
  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;
}
