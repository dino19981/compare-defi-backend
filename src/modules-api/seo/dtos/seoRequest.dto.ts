import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum SeoLanguage {
  RU = 'ru',
  EN = 'en',
}

export class SeoRequestDto {
  @ApiProperty()
  @IsString()
  pathname: string;

  @ApiProperty()
  @IsString()
  @IsEnum(SeoLanguage)
  language: SeoLanguage;
}
