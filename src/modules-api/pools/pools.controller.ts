import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoolsService } from './pools.service';
import { PoolsResponseDto } from './dtos/pool.dto';
import { SwaggerSchemaDecorator } from '../../decorators';

@ApiTags('pools')
@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaResponse: PoolsResponseDto,
    description: 'Получить список пуллов',
  })
  getPoolItems(): Promise<PoolsResponseDto> {
    return this.poolsService.getPoolsItems();
  }

  @Get('without-job')
  @SwaggerSchemaDecorator({
    schemaResponse: PoolsResponseDto,
    description: 'Получить список пуллов без job',
  })
  getPoolsItemsWithoutJob(): Promise<PoolsResponseDto> {
    return this.poolsService.getPoolsItemsJob();
  }
}
