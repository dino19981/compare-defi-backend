import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BitgetService } from './bitget.service';

@Module({
  imports: [HttpModule],
  providers: [BitgetService],
  exports: [BitgetService],
})
export class BitgetModule {}
