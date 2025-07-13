import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthResponseDto } from './dto/health-response.dto';
import { SwaggerSchemaDecorator } from './decorators';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @SwaggerSchemaDecorator({
    schemaResponse: HealthResponseDto,
    description: 'Health check',
  })
  getHello(): HealthResponseDto {
    const message = this.appService.getHello();
    return {
      message,
      timestamp: new Date().toISOString(),
    };
  }
}
