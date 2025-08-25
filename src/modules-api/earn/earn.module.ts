import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarnController } from './earn.controller';
import { EarnService } from './earn.service';
import { EarnEntity } from './earn.entity';
import { EarnRepository } from './earn.repository';
import { BinanceModule } from '@modules/binance';
import { BybitModule } from '@modules/bybit';
import { OkxModule } from '@modules/okx';
import { KukoinModule } from '@modules/kukoin';
import { HtxModule } from '@modules/htx';
import { BitgetModule } from '@modules/bitget';
import { BingXModule } from '@modules/bingX';
import { MexcModule } from '@modules/mexc';
import { SparkModule } from '@modules/spark';
import { LidoModule } from '@modules/lido';
import { VenusModule } from '@modules/venus';
import { NaviModule } from '@modules/navi';
import { JitoModule } from '@modules/jito';
import { DatabaseModule } from '@modules/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([EarnEntity]),
    BinanceModule,
    BybitModule,
    OkxModule,
    KukoinModule,
    HtxModule,
    BitgetModule,
    BingXModule,
    MexcModule,
    SparkModule,
    LidoModule,
    VenusModule,
    NaviModule,
    JitoModule,
    DatabaseModule,
  ],
  controllers: [EarnController],
  providers: [EarnService, EarnRepository],
  exports: [EarnService],
})
export class EarnModule {}
