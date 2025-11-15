import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { LendingPlatformNameDto } from './lendingPlatformDto.dto';
import { LendingPlatformName } from '../types';
import { PoolItemTokenDto } from './lendingToken.dto';
import { ChainDto } from 'src/shared/dtos/chain.dto';
import { MetaDto } from 'src/shared/dtos/meta.dto';

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
  @Type(() => LendingPlatformNameDto)
  platform: LendingPlatformNameDto;

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
    example: [],
    required: false,
  })
  @IsArray()
  @IsOptional()
  badges?: string[];
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
      platforms: [LendingPlatformName.Aave],
    },
  })
  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;
}
