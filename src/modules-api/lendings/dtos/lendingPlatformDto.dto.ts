import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LendingPlatformName } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class LendingPlatformNameDto {
  @ApiProperty({
    description: 'Название платформы',
    example: 'Uniswap',
    type: String,
    enum: LendingPlatformName,
  })
  @IsString()
  @IsEnum(LendingPlatformName, { each: true })
  name: LendingPlatformName;

  @ApiProperty({
    description: 'Ссылка на платформу',
    example: 'https://uniswap.org',
  })
  @IsString()
  link: string;

  @ApiProperty({
    description: 'Ссылка на платформу с рефкой',
    example: 'https://uniswap.org/ref/CPA_00CR5Q0KBD',
  })
  @IsOptional()
  @IsString()
  refLink: string;
}
