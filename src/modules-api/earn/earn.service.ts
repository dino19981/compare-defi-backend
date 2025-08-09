import { Injectable, Logger } from '@nestjs/common';
import { EarnItemDto, EarnResponseDto } from './dtos/earn.dto';
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
import * as path from 'path';
import * as fs from 'fs';
import { EARN_DATA_FILE_NAME } from './constants/localDataEarnPath';

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

  async getEarnItems(): Promise<EarnResponseDto> {
    const dataDir = path.join(process.cwd(), 'data');

    const filePath = path.join(dataDir, EARN_DATA_FILE_NAME);

    if (!fs.existsSync(filePath)) {
      const earnData = await this.getEarnItemsJob();

      if (!fs.existsSync(dataDir)) {
        await fs.promises.mkdir(dataDir, { recursive: true });
      }

      const dataToSave = {
        totalItems: earnData.data.length,
        data: earnData.data,
      };

      await fs.promises.writeFile(filePath, JSON.stringify(dataToSave), 'utf8');

      return dataToSave;
    }

    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as EarnResponseDto;
  }
}
