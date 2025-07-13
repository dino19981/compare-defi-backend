import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HtxService } from './htx.service';

@Module({
  imports: [HttpModule],
  providers: [HtxService],
  exports: [HtxService],
})
export class HtxModule {}
