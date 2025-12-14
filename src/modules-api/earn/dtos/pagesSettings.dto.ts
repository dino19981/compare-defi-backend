import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SortDirection } from 'src/shared/types';
import { Sort } from 'src/shared/dtos/sortAndFilters.dto';

export class PageSettings {
  @ApiProperty({ description: 'Алиас страницы', example: 'earn-stables' })
  @IsString()
  alias: string;

  @ApiProperty({ description: 'Путь страницы', example: '/earn/stables' })
  @IsString()
  path: string;

  @ApiProperty({
    description: 'Параметры запроса',
    example: { tokenName: ['USD'] },
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  requestParams?: Record<string, any>;

  @ApiProperty({ description: 'Показывать фильтр платформ', example: true })
  @IsBoolean()
  isShowPlatformFilter: boolean;

  @ApiProperty({ description: 'Показывать фильтр платформ', example: true })
  @IsBoolean()
  isShowTokenFilter: boolean;

  @ApiProperty({
    description: 'Сортировка',
    example: { field: 'positions.seo', direction: SortDirection.Desc },
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Sort)
  sort?: Sort;
}

export class PagesSettingsDto {
  @ApiProperty({
    description: 'Настройки страниц',
    type: [PageSettings],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageSettings)
  data: PageSettings[];
}
