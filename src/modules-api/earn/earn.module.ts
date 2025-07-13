import { Module } from '@nestjs/common';
import { EarnController } from './earn.controller';
import { EarnService } from './earn.service';
import { BinanceModule } from '@modules/binance';
import { BybitModule } from '@modules/bybit';
import { OkxModule } from '@modules/okx';
import { KukoinModule } from '@modules/kukoin';
import { HtxModule } from '@modules/htx';
import { BitgetModule } from '@modules/bitget';
import { BingXModule } from '@modules/bingX';

@Module({
  imports: [
    BinanceModule,
    BybitModule,
    OkxModule,
    KukoinModule,
    HtxModule,
    BitgetModule,
    BingXModule,
  ],
  controllers: [EarnController],
  providers: [EarnService],
  exports: [EarnService],
})
export class EarnModule {}
