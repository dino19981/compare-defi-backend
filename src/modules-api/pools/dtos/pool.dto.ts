import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested } from 'class-validator';

export class PoolItemDto {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 'earn_001' })
  @IsString()
  id: string;
}

export class EarnResponseDto {
  @ApiProperty({
    description: 'Массив элементов earn',
    type: [PoolItemDto],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PoolItemDto)
  data: PoolItemDto[];
}
