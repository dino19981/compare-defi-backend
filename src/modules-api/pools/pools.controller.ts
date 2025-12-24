import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoolsService } from './pools.service';
import { PoolsResponseDto } from './dtos/pool.dto';
import { SwaggerSchemaDecorator } from '../../decorators';
import { PoolRequest } from './dtos/poolRequest.dto';

@ApiTags('pools')
@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaQuery: PoolRequest,
    schemaResponse: PoolsResponseDto,
    description: 'Получить список пуллов',
  })
  getPoolItems(@Query() query: PoolRequest): Promise<PoolsResponseDto> {
    return this.poolsService.getPoolsItems(query);
  }

  // @Get('save-tokens')
  // saveTokens() {
  //   return this.poolsService.testTokens();
  // }

  @Get('update-pool-items-in-db')
  @SwaggerSchemaDecorator({
    schemaResponse: PoolsResponseDto,
    description: 'Получить список пуллов',
  })
  updatePoolItemsInDb(): Promise<PoolsResponseDto> {
    return this.poolsService.smartUpdatePoolItemsInDb();
  }
}
