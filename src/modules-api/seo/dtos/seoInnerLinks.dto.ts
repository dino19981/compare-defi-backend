import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class SeoInnerLinkDto {
  @ApiProperty({ description: 'Name', example: 'Name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Link', example: 'Link' })
  @IsString()
  link: string;
}

export class SeoInnerLinksDto {
  @ApiProperty({ description: 'Title', example: 'Title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Links', example: 'Links' })
  @ValidateNested({ each: true })
  @Type(() => SeoInnerLinkDto)
  @IsArray()
  links: SeoInnerLinkDto[];
}
