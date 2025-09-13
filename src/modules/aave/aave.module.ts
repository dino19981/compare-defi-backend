import { Module } from '@nestjs/common';
import { AaveService } from './aave.service';

@Module({
  providers: [AaveService],
  exports: [AaveService],
})
export class AaveModule {}
