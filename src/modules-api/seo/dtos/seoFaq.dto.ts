import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class SeoFaqItemDto {
  @ApiProperty({ description: 'Question', example: 'Question' })
  @IsString()
  question: string;

  @ApiProperty({ description: 'Answer', example: 'Answer' })
  @IsString()
  answer: string;
}

export class SeoFaqDto {
  @ApiProperty({ description: 'Title', example: 'Title' })
  @IsString()
  title: string;

  @ApiProperty({ type: [SeoFaqItemDto], description: 'Items' })
  @ValidateNested({ each: true })
  @Type(() => SeoFaqItemDto)
  @IsArray()
  items: SeoFaqItemDto[];
}
