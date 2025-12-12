import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SeoHeadDto } from './seoHead.dto';
import { SeoFaqDto } from './seoFaq.dto';
import { SeoPageDescription } from './seoPageDescription.dto';
import { SeoInnerLinksDto } from './seoInnerLinks.dto';

export class SeoDto {
  @ApiProperty({ description: 'SEO head' })
  @ValidateNested()
  @Type(() => SeoHeadDto)
  head: SeoHeadDto;

  @ApiProperty({ description: 'title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Page description' })
  @ValidateNested({ each: true })
  @Type(() => SeoPageDescription)
  @IsArray()
  pageDescription: SeoPageDescription[];

  @ApiProperty({ description: 'faq' })
  @ValidateNested()
  @Type(() => SeoFaqDto)
  faq: SeoFaqDto;

  @ApiProperty({ type: SeoInnerLinksDto, description: 'inner links' })
  @ValidateNested({ each: true })
  @Type(() => SeoInnerLinksDto)
  innerLinks: SeoInnerLinksDto;
}

export class SeoByLanguageDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => SeoDto)
  ru: SeoDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SeoDto)
  en: SeoDto;
}

export class SeoResponseDto {
  @ApiProperty()
  @IsString()
  pathname: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SeoDto)
  @IsNotEmpty()
  data: SeoDto;
}
