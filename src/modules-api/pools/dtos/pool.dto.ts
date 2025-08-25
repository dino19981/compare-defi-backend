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
import { PoolItemChainDto } from './poolItemChain.dto';
import { PoolItemPlatformDto } from './poolItemPlatformDto.dto';
import { PoolItemBadge } from '../types';
import { PoolItemTokenDto } from './poolItemToken.dto';

export class PoolItemDto {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 'pool_001' })
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => PoolItemTokenDto)
  firstToken: PoolItemTokenDto;

  @ValidateNested()
  @Type(() => PoolItemTokenDto)
  secondToken: PoolItemTokenDto;

  @ValidateNested()
  @Type(() => PoolItemChainDto)
  chain: PoolItemChainDto;

  @ValidateNested()
  @Type(() => PoolItemPlatformDto)
  platform: PoolItemPlatformDto;

  @IsNumber()
  tvl: string;

  @IsNumber()
  volume: string;

  @IsNumber()
  fee: string;

  @IsNumber()
  apr: string;

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
}
