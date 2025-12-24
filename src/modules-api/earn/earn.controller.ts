import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EarnService } from './earn.service';
import { EarnRequest, EarnResponseDto } from './dtos/earn.dto';
import { SwaggerSchemaDecorator } from '../../decorators';
import { PagesSettingsDto } from './dtos/pagesSettings.dto';

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

  @Get('pages-settings')
  @SwaggerSchemaDecorator({
    schemaResponse: PagesSettingsDto,
    description: 'Получить настройки страниц',
  })
  getPagesSettings(): PagesSettingsDto {
    return this.earnService.getPagesSettings();
  }

  @Get('update-earn-items-in-db')
  @SwaggerSchemaDecorator({
    schemaResponse: EarnResponseDto,
    description: 'Получить список earn элементов',
  })
  updateEarnItemsInDb(): Promise<EarnResponseDto> {
    return this.earnService.smartUpdateEarnItemsInDb();
  }

  // @Get('update-positions')
  // @SwaggerSchemaDecorator({
  //   schemaResponse: EarnResponseDto,
  //   description: 'Получить список earn элементов',
  // })
  // updateEarnItemsInwqeDb() {
  //   return this.earnService.updateEarnItemsInwqeDb();
  // }
}
