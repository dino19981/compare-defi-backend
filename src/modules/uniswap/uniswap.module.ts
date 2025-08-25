import { Module } from '@nestjs/common';
import { UniSwapService } from './uniswap.service';

@Module({
  providers: [UniSwapService],
  exports: [UniSwapService],
})
export class UniSwapModule {}
