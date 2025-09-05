import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LandingsService } from './lendings.service';
import { PoolsResponseDto } from './dtos/lendings.dto';
import { SwaggerSchemaDecorator } from '../../decorators';
import { PoolRequest } from './dtos/lendingRequest.dto';

@ApiTags('pools')
@Controller('pools')
export class LandingsController {
  constructor(private readonly landingsService: LandingsService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaQuery: PoolRequest,
    schemaResponse: PoolsResponseDto,
    description: 'Получить список лэндингов',
  })
  getPoolItems(@Query() query: PoolRequest): Promise<PoolsResponseDto> {
    return this.landingsService.getLandingsItems(query);
  }

  @Get('without-job')
  @SwaggerSchemaDecorator({
    schemaQuery: PoolRequest,
    schemaResponse: PoolsResponseDto,
    description: 'Получить список лэндингов без job',
  })
  getPoolsItemsWithoutJob(): Promise<PoolsResponseDto> {
    return this.landingsService.getLandingsItemsJob();
  }
}
