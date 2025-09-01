import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { Application } from 'express';
import { config } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = config();

  app.enableCors('*');

  // Enable extended query parsing (uses 'qs' under the hood) so keys like
  // filter[platform.name][0]=Kucoin are parsed into nested objects
  const httpAdapter = app.getHttpAdapter();
  const expressInstance = httpAdapter.getInstance?.() as
    | Application
    | undefined;
  expressInstance?.set('query parser', 'extended');

  // Настройка Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.swagger.title)
    .setDescription(appConfig.swagger.description)
    .setVersion(appConfig.swagger.version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appConfig.port);
}

void bootstrap();
