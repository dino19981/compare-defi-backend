import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChainDto {
  @ApiProperty({ description: 'Название сети', example: 'Eth' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Урл картинки сети', example: 'https...' })
  @IsString()
  imageUrl: string;
}
