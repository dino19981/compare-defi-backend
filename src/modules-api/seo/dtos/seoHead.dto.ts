import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SeoHeadDto {
  @ApiProperty({ description: 'SEO title', example: 'SEO title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'SEO description', example: 'SEO description' })
  @IsString()
  description: string;
}
