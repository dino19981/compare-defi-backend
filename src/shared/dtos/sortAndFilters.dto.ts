import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SortDirection } from '../types';

class Sort {
  @ApiProperty({
    description: 'Поле для сортировки',
    example: 'maxRate',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Направление сортировки',
    enum: SortDirection,
    example: SortDirection.Desc,
  })
  @IsEnum(SortDirection)
  direction: SortDirection;
}

export class SortAndFilters {
  @ApiProperty({ description: 'Сортировка', nullable: true, required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => Sort || null)
  sort?: Sort;

  @ApiProperty({ description: 'Фильтрация', nullable: true, required: false })
  @IsOptional()
  filter?: Record<string, any>;
}
