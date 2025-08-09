import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { EarnPlatform } from '../types';

export class EarnItemPlatformDto {
  @ApiProperty({
    description: 'Название платформы',
    example: 'Binance',
    enum: EarnPlatform,
  })
  @IsString()
  name: EarnPlatform;

  @ApiProperty({
    description: 'Ссылка на платформу',
    example: 'https://binance.com',
  })
  @IsUrl()
  link: string;

  @ApiProperty({
    description: 'Ссылка на платформу с рефкой',
    example: 'https://binance.com/ref/CPA_00CR5Q0KBD',
  })
  @IsOptional()
  @IsUrl()
  refLink?: string;
}
