import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EarnService } from './earn.service';
import { EarnResponseDto } from './dtos/pool.dto';
import { SwaggerSchemaDecorator } from '../../decorators';

@ApiTags('earn')
@Controller('earn')
export class EarnController {
  constructor(private readonly earnService: EarnService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaResponse: EarnResponseDto,
    description: 'Получить список earn элементов',
  })
  getEarnItems(): Promise<EarnResponseDto> {
    return this.earnService.getEarnItems();
  }

  @Get('without-job')
  @SwaggerSchemaDecorator({
    schemaResponse: EarnResponseDto,
    description: 'Получить список earn элементов',
  })
  getEarnItemsWithoutJob(): Promise<EarnResponseDto> {
    return this.earnService.getEarnItemsJob();
  }
}
