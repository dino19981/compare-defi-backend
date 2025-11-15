import { ApiProperty } from '@nestjs/swagger';
import { SortAndFilters } from './sortAndFilters.dto';
import { Type } from 'class-transformer';

export class BaseRequestQueries extends SortAndFilters {
  @ApiProperty({ description: 'лимит', required: true })
  @Type(() => Number)
  limit: number;

  @ApiProperty({ description: 'сдвиг', required: true })
  @Type(() => Number)
  skip: number;
}
