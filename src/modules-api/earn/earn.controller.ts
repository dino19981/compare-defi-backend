import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EarnService } from './earn.service';
import { EarnRequest, EarnResponseDto } from './dtos/earn.dto';
import { SwaggerSchemaDecorator } from '../../decorators';

@ApiTags('earn')
@Controller('earn')
export class EarnController {
  constructor(private readonly earnService: EarnService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaRequest: EarnRequest,
    schemaResponse: EarnResponseDto,
    description: 'Получить список earn элементов',
  })
  getEarnItems(@Query() query: EarnRequest): Promise<EarnResponseDto> {
    return this.earnService.getEarnItems(query);
  }

  @Get('without-job')
  @SwaggerSchemaDecorator({
    schemaResponse: EarnResponseDto,
    description: 'Получить список earn элементов',
  })
  getEarnItemsWithoutJob(): Promise<EarnResponseDto> {
    return this.earnService.fetchEarnItems();
  }
}
