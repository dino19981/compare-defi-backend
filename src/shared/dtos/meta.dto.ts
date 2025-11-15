import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MetaDto {
  @ApiProperty({
    description: 'Платформы',
    type: [String],
    example: [],
  })
  platforms: string[];

  @ApiProperty({
    description: 'Общее количество пулов',
    type: Number,
    example: 0,
  })
  @IsNumber()
  totalItems: number;
}
