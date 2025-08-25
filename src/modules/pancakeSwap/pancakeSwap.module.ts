import { Module } from '@nestjs/common';
import { PancakeSwapService } from './pancakeSwap.service';

@Module({
  providers: [PancakeSwapService],
  exports: [PancakeSwapService],
})
export class PancakeSwapModule {}
