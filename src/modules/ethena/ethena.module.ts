import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EthenaService } from './ethena.service';

@Module({
  imports: [HttpModule],
  providers: [EthenaService],
  exports: [EthenaService],
})
export class EthenaModule {}
