import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class SeoInnerLinkItemDto {
  @ApiProperty({ description: 'Title', example: 'Title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Link', example: 'Link' })
  @IsString()
  link: string;
}

export class SeoInnerLinkDto {
  @ApiProperty({ description: 'Title', example: 'Title' })
  @IsString()
  title: string;

  @ApiProperty({
    type: [SeoInnerLinkItemDto],
    description: 'Links',
    example: 'Links',
  })
  @ValidateNested({ each: true })
  @Type(() => SeoInnerLinkItemDto)
  @IsArray()
  links: SeoInnerLinkItemDto[];
}

export class SeoInnerLinksDto {
  @ApiProperty({ description: 'Title', example: 'Title' })
  @IsString()
  title: string;

  @ApiProperty({
    type: [SeoInnerLinkDto],
    description: 'Links data',
    example: 'Links data',
  })
  @ValidateNested({ each: true })
  @Type(() => SeoInnerLinkDto)
  @IsArray()
  items: SeoInnerLinkDto[];
}
