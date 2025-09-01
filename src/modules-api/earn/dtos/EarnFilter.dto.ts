import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { SortDirection } from 'src/shared/types';

export class EarnFilter {
  @ApiProperty({
    description: 'Поле для фильтрации',
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
