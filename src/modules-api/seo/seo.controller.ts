import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeoService } from './seo.service';
import { SeoResponseDto } from './dtos/seo.dto';
import { SwaggerSchemaDecorator } from '../../decorators';
import { SeoRequestDto } from './dtos/seoRequest.dto';

@ApiTags('seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  @SwaggerSchemaDecorator({
    schemaQuery: SeoRequestDto,
    schemaResponse: SeoResponseDto,
    description: 'Получить SEO для страницы',
  })
  getPoolItems(@Query() query: SeoRequestDto): Promise<SeoResponseDto> {
    return this.seoService.getSeo(query);
  }
}
