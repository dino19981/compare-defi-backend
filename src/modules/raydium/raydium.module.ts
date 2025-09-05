import { Module } from '@nestjs/common';
import { RaydiumService } from './raydium.service';

@Module({
  providers: [RaydiumService],
  exports: [RaydiumService],
})
export class RaydiumModule {}
