import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JitoService } from './jito.service';

@Module({
  imports: [HttpModule],
  providers: [JitoService],
  exports: [JitoService],
})
export class JitoModule {}
