import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SeoPageDescription {
  @ApiProperty({ description: 'html text', example: 'html text' })
  @IsString()
  text: string;
}
