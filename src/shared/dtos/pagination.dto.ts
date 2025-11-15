import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Общее количество элементов',
    type: Number,
    example: 0,
  })
  @IsNumber()
  total: number;
}
