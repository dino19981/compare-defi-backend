import { ApiProperty } from '@nestjs/swagger';
import { SortAndFilters } from 'src/shared/dtos/sortAndFilters.dto';

export class PoolRequest extends SortAndFilters {
  @ApiProperty({ description: 'Кол-во элементов на странице' })
  limit?: number;
}
