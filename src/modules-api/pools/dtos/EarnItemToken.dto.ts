import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AvailableTokens, AVAILABLE_TOKENS } from '../helpers';

export class EarnItemTokenDto {
  @ApiProperty({
    description: 'Название токена',
    example: 'BTC',
    enum: AVAILABLE_TOKENS,
  })
  @IsEnum(AVAILABLE_TOKENS)
  name: AvailableTokens;
}
