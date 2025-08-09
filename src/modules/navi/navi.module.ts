import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NaviService } from './navi.service';

@Module({
  imports: [HttpModule],
  providers: [NaviService],
  exports: [NaviService],
})
export class NaviModule {}
