import { SeoDto } from './seo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SeoResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => SeoDto)
  data: SeoDto[];
}
