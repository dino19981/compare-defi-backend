import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class EarnItemRateSettingsDto {
  @ApiProperty({ description: 'Минимальная сумма', example: 10_000 })
  @IsNumber()
  min: number;

  @ApiProperty({
    description: 'Максимальная сумма',
    example: 100_000,
    oneOf: [{ type: 'number' }, { type: 'string', enum: ['Infinity'] }],
  })
  @IsNumber()
  max: number | 'Infinity';

  @ApiProperty({ description: 'Текущий APY', example: 5.5 })
  @IsNumber()
  apy: number;
}
