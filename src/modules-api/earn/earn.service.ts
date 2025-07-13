import { Injectable } from '@nestjs/common';
import { EarnResponseDto } from './dtos/earn.dto';
import { BinanceService } from '@modules/binance';
import { BybitService } from '@modules/bybit';
import { OkxService } from '@modules/okx';
import { KukoinService } from '@modules/kukoin';
import { HtxService } from '@modules/htx';
import { BitgetService } from '@modules/bitget';
import { BingXService } from '@modules/bingX';
import {
  EarnMapper,
  formatBinanceEarn,
  formatOkxEarn,
  formatKukoinEarn,
  formatHtxEarn,
  formatBitgetEarn,
  formatBybitEarn,
} from './formatters';

@Injectable()
export class EarnService {
  constructor(
    private readonly binanceService: BinanceService,
    private readonly bybitService: BybitService,
    private readonly okxService: OkxService,
    private readonly kukoinService: KukoinService,
    private readonly htxService: HtxService,
    private readonly bitgetService: BitgetService,
    private readonly bingXService: BingXService,
  ) {}

  async getEarnItems(): Promise<EarnResponseDto> {
    try {
      const [
        binanceData,
        okxData,
        kukoinData,
        htxData,
        bitgetData,
        bybitData,
        // bingXData,
      ] = await Promise.allSettled([
        this.binanceService.getEarnItems(),
        this.okxService.getEarnItems(),
        this.kukoinService.getEarnItems(),
        this.htxService.getEarnItems(),
        this.bitgetService.getEarnItems(),
        this.bybitService.getEarnItems(),

        this.bingXService.getEarnItems(),
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
        // ...(bingXData.status === 'fulfilled' ? formatBingXEarn(bingXData.value) : []),
      ];

      console.log(earnItems.length, 'earn items');

      const earnItemsDto = earnItems.map((item) => EarnMapper.toDto(item));

      return {
        data: earnItemsDto,
      };
    } catch (error) {
      console.error('Error fetching earn items:', error);
      return {
        data: [],
      };
    }
  }
}
