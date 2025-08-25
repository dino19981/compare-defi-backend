import { Injectable, Logger } from '@nestjs/common';
import { EarnItemDto, EarnRequest, EarnResponseDto } from './dtos/earn.dto';
import { BinanceService } from '@modules/binance';
import { BybitService } from '@modules/bybit';
import { OkxService } from '@modules/okx';
import { KukoinService } from '@modules/kukoin';
import { HtxService } from '@modules/htx';
import { BitgetService } from '@modules/bitget';
import { BingXService } from '@modules/bingX';
import {
  formatBinanceEarn,
  formatOkxEarn,
  formatKukoinEarn,
  formatHtxEarn,
  formatBitgetEarn,
  formatBybitEarn,
  // formatBingXEarn,
  formatMexcEarn,
  formatSparkEarn,
  formatLidoEarn,
  LidoEarnDto,
  formatVenusEarn,
  formatNaviEarn,
  formatJitoEarn,
} from './formatters';
import { MexcService } from '@modules/mexc';
import { SparkService } from '@modules/spark';
import { LidoService } from '@modules/lido';
import { VenusService } from '@modules/venus';
import { NaviService } from '@modules/navi';
import { JitoService } from '@modules/jito';
import { EarnRepository } from './earn.repository';

@Injectable()
export class EarnService {
  private readonly logger = new Logger(EarnService.name);
  constructor(
    private readonly binanceService: BinanceService,
    private readonly bybitService: BybitService,
    private readonly okxService: OkxService,
    private readonly kukoinService: KukoinService,
    private readonly htxService: HtxService,
    private readonly bitgetService: BitgetService,
    private readonly bingXService: BingXService,
    private readonly mexcService: MexcService,
    private readonly sparkService: SparkService,
    private readonly lidoService: LidoService,
    private readonly venusService: VenusService,
    private readonly naviService: NaviService,
    private readonly jitoService: JitoService,
    private readonly earnRepository: EarnRepository,
  ) {}

  async getEarnItemsJob(): Promise<EarnResponseDto> {
    try {
      const [
        binanceData,
        okxData,
        kukoinData,
        htxData,
        bitgetData,
        bybitData,
        // bingXData,
        mexcData,
        sparkData,
        lidoData,
        venusData,
        naviData,
        jitoData,
      ] = await Promise.allSettled([
        this.binanceService.getEarnItems(),
        this.okxService.getEarnItems(),
        this.kukoinService.getEarnItems(),
        this.htxService.getEarnItems(),
        this.bitgetService.getEarnItems(),
        this.bybitService.getEarnItems(),
        // this.bingXService.getEarnItems(),
        this.mexcService.getEarnItems(),
        this.sparkService.getSavingsRates(),
        this.lidoService.getApr(),
        this.venusService.getPools(),
        this.naviService.getPools(),
        this.jitoService.getApr(),
      ]);

      const earnItems = [
        ...(binanceData.status === 'fulfilled'
          ? formatBinanceEarn(binanceData.value)
          : []),
        ...(okxData.status === 'fulfilled' ? formatOkxEarn(okxData.value) : []),
        ...(kukoinData.status === 'fulfilled'
          ? formatKukoinEarn(kukoinData.value)
          : []),
        ...(htxData.status === 'fulfilled' ? formatHtxEarn(htxData.value) : []),
        ...(bitgetData.status === 'fulfilled'
          ? formatBitgetEarn(bitgetData.value)
          : []),
        ...(bybitData.status === 'fulfilled'
          ? formatBybitEarn(bybitData.value)
          : []),
        // ...(bingXData.status === 'fulfilled'
        //   ? formatBingXEarn(bingXData.value)
        //   : []),
        ...(mexcData.status === 'fulfilled'
          ? formatMexcEarn(mexcData.value)
          : []),
        ...(sparkData.status === 'fulfilled'
          ? formatSparkEarn(sparkData.value)
          : []),
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        ...(lidoData.status === 'fulfilled'
          ? /* eslint-disable @typescript-eslint/no-unsafe-call */
            formatLidoEarn(lidoData.value as LidoEarnDto[])
          : []),
        ...(venusData.status === 'fulfilled'
          ? formatVenusEarn(venusData.value)
          : []),
        ...(naviData.status === 'fulfilled'
          ? formatNaviEarn(naviData.value)
          : []),
        ...(jitoData.status === 'fulfilled'
          ? formatJitoEarn(jitoData.value)
          : []),
      ];

      return {
        data: earnItems as never as EarnItemDto[],
      };
    } catch (error) {
      console.error('Error fetching earn items:', error);
      return {
        data: [],
      };
    }
  }

  async getEarnItems(query: EarnRequest): Promise<EarnResponseDto> {
    try {
      const earnItems = await this.earnRepository.findAll(query);
      console.log(earnItems.length, 'earnItemsearnItemsearnItemsearnItems');

      if (!earnItems.length) {
        const earnData = await this.saveEarnItemsInDb();

        return {
          data: earnData.data,
        };
      }

      return {
        data: earnItems,
      };
    } catch (e: any) {
      this.logger.error(`Не удалось получить Earn, ${e?.message}`);

      return {
        data: [],
      };
    }
  }

  async saveEarnItemsInDb() {
    const earnData = await this.getEarnItemsJob();
    await this.earnRepository.saveMany(earnData.data);

    return earnData;
  }
}
