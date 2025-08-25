import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SortDirection } from 'src/shared/types';

export class EarnFilter {
  @IsString()
  field: string;

  @ApiProperty({
    example: '-1',
    enum: SortDirection,
  })
  @IsString()
  direction: SortDirection;
}
