import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KukoinService } from './kukoin.service';

@Module({
  imports: [HttpModule],
  providers: [KukoinService],
  exports: [KukoinService],
})
export class KukoinModule {}
