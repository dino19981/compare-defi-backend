import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MexcService } from './mexc.service';

@Module({
  imports: [HttpModule],
  providers: [MexcService],
  exports: [MexcService],
})
export class MexcModule {}
