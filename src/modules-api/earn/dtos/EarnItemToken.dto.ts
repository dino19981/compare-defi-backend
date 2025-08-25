import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AvailableTokensForEarn, AVAILABLE_TOKENS_FOR_EARN } from '../helpers';

export class EarnItemTokenDto {
  @ApiProperty({
    description: 'Название токена',
    example: 'BTC',
    enum: AVAILABLE_TOKENS_FOR_EARN,
  })
  @IsEnum(AVAILABLE_TOKENS_FOR_EARN)
  name: AvailableTokensForEarn;
}
