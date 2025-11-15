import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { SeoRepository } from './seo.repository';
import { SeoEntity, SeoSchema } from './seo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SeoEntity.name, schema: SeoSchema }]),
  ],
  controllers: [SeoController],
  providers: [SeoService, SeoRepository],
  exports: [SeoService],
})
export class SeoModule {}
