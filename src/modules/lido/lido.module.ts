import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LidoService } from './lido.service';

@Module({
  imports: [HttpModule],
  providers: [LidoService],
  exports: [LidoService],
})
export class LidoModule {}
