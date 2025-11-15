import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EarnController } from './earn.controller';
import { EarnService } from './earn.service';
import { EarnEntity, EarnSchema } from './entities/earn.entity';
import { EarnRepository } from './repositories/earn.repository';
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
import { TokensModule } from '@shared-modules/tokens';
import { EarnMetaEntity, EarnMetaSchema } from './entities';
import { EarnMetaRepository } from './repositories';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EarnEntity.name, schema: EarnSchema }]),
    MongooseModule.forFeature([
      { name: EarnMetaEntity.name, schema: EarnMetaSchema },
    ]),
    TokensModule,
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
  ],
  controllers: [EarnController],
  providers: [EarnService, EarnRepository, EarnMetaRepository],
  exports: [EarnService],
})
export class EarnModule {}
