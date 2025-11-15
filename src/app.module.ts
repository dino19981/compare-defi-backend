import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarnModule } from './modules-api/earn/earn.module';
import { PoolsModule } from './modules-api/pools/pools.module';
import { LendingsModule } from '@modules-api/lendings/lendings.module';
import { databaseConfig } from './configs/database.config';
import { TokensJob, EarnDataJob, PoolsDataJob } from './jobs';
import { TokensModule } from '@shared-modules/tokens';
import { RedisModule } from '@shared-modules/redis';
import { SeoModule } from './modules-api/seo/seo.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    TokensModule,
    EarnModule,
    PoolsModule,
    LendingsModule,
    SeoModule,
  ],
  controllers: [AppController],
  providers: [AppService, EarnDataJob, PoolsDataJob, TokensJob],
})
export class AppModule {}
