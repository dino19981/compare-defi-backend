import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LendingsService } from './lendings.service';
import { LendingResponseDto } from './dtos/lendings.dto';
import { SwaggerSchemaDecorator } from '../../decorators';
import { LendingRequest } from './dtos/lendingRequest.dto';

@ApiTags('lending')
@Controller('lending')
export class LendingsController {
  constructor(private readonly lendingsService: LendingsService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaQuery: LendingRequest,
    schemaResponse: LendingResponseDto,
    description: 'Получить список лэндингов',
  })
  getPoolItems(@Query() query: LendingRequest): Promise<LendingResponseDto> {
    return this.lendingsService.getLendingItems(query);
  }

  @Get('without-job')
  @SwaggerSchemaDecorator({
    schemaQuery: LendingRequest,
    schemaResponse: LendingResponseDto,
    description: 'Получить список лэндингов без job',
  })
  getPoolsItemsWithoutJob(): Promise<LendingResponseDto> {
    return this.lendingsService.getLendingItemsJob();
  }
}
