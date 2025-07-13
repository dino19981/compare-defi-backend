import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BybitService } from './bybit.service';

@Module({
  imports: [HttpModule],
  providers: [BybitService],
  exports: [BybitService],
})
export class BybitModule {}
