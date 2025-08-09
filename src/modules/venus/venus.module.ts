import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VenusService } from './venus.service';

@Module({
  imports: [HttpModule],
  providers: [VenusService],
  exports: [VenusService],
})
export class VenusModule {}
