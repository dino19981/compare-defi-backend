import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BingXService } from './bingX.service';

@Module({
  imports: [HttpModule],
  providers: [BingXService],
  exports: [BingXService],
})
export class BingXModule {}
