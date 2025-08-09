import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SparkService } from './spark.service';

@Module({
  imports: [HttpModule],
  providers: [SparkService],
  exports: [SparkService],
})
export class SparkModule {}
