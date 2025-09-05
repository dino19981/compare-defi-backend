import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PoolItemTokenDto {
  @ApiProperty({ description: 'Название токена', example: 'USDC' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Урл картинки токена', example: 'https...' })
  @IsString()
  imageUrl: string;
}
