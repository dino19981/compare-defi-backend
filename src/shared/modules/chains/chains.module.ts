import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChainsService } from './chains.service';

@Module({
  imports: [HttpModule],
  providers: [ChainsService],
  exports: [ChainsService],
})
export class ChainsModule {}
