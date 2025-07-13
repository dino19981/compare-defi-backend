import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = config();

  // Настройка Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.swagger.title)
    .setDescription(appConfig.swagger.description)
    .setVersion(appConfig.swagger.version)
    .addTag('earnings', 'Операции с заработком')
    .addTag('stacking', 'Операции со стейкингом')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appConfig.port);
}

bootstrap();
