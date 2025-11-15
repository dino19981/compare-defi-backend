import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class EarnItemTokenDto {
  @ApiProperty({
    description: 'Название токена',
    example: 'BTC',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Урл картинки токена',
    example: 'https://example.com/token.png',
  })
  @ApiProperty({
    description: 'Ссылка на платформу',
    example: 'https://binance.com',
  })
  @IsUrl()
  icon: string;
}
