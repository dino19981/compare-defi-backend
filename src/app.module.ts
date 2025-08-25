import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarnModule } from './modules-api/earn/earn.module';
import { EarnDataJob } from './jobs/earn-data.job';
import { PoolsModule } from './modules-api/pools/pools.module';

@Module({
  imports: [ScheduleModule.forRoot(), EarnModule, PoolsModule],
  controllers: [AppController],
  providers: [AppService, EarnDataJob],
})
export class AppModule {}
