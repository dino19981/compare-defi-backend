import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarnModule } from './modules-api/earn/earn.module';
import { EarnDataJob } from './jobs/earn-data.job';
import { PoolsModule } from './modules-api/pools/pools.module';
import { LendingsModule } from '@modules-api/lendings/lendings.module';
import { PoolsDataJob } from './jobs/pools-data.job';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    ScheduleModule.forRoot(),
    EarnModule,
    PoolsModule,
    LendingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EarnDataJob, PoolsDataJob],
})
export class AppModule {}
