import { Module } from '@nestjs/common';
import { CetusService } from './cetus.service';

@Module({
  providers: [CetusService],
  exports: [CetusService],
})
export class CetusModule {}
