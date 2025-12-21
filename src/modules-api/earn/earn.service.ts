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
  formatJitoEarn,
} from './formatters';
import { MexcService } from '@modules/mexc';
import { SparkService } from '@modules/spark';
import { LidoService } from '@modules/lido';
import { VenusService } from '@modules/venus';
import { NaviService } from '@modules/navi';
import { JitoService } from '@modules/jito';
import { EarnRepository } from './repositories/earn.repository';
import { TokensService } from 'src/shared/modules/tokens';
import { EarnMetaDto } from './dtos/EarnMeta.dto';
import { EarnMetaRepository } from './repositories/earnMeta.repository';
import { PagesSettingsDto } from './dtos/pagesSettings.dto';
import { earnRoutes } from './constants';

const DEFAULT_META: EarnMetaDto = {
  platforms: [],
  totalItems: 0,
  tokens: [],
};

@Injectable()
export class EarnService {
  private readonly logger = new Logger(EarnService.name);

  constructor(
    private readonly tokensService: TokensService,
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
    private readonly earnMetaRepository: EarnMetaRepository,
  ) { }

  async fetchEarnItems(): Promise<EarnResponseDto> {
    try {
      const [
        tokensData,
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
        // naviData,
        jitoData,
      ] = await Promise.allSettled([
        this.tokensService.getAllTokens(),
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
        this.venusService.getEarnItems(),
        // this.naviService.getEarnItems(),
        this.jitoService.getApr(),
      ]);

      const tokens = tokensData.status === 'fulfilled' ? tokensData.value : {};

      const earnItems = [
        ...(binanceData.status === 'fulfilled'
          ? formatBinanceEarn(binanceData.value, tokens)
          : []),
        ...(okxData.status === 'fulfilled'
          ? formatOkxEarn(okxData.value, tokens)
          : []),
        ...(kukoinData.status === 'fulfilled'
          ? formatKukoinEarn(kukoinData.value, tokens)
          : []),
        ...(htxData.status === 'fulfilled'
          ? formatHtxEarn(htxData.value, tokens)
          : []),
        ...(bitgetData.status === 'fulfilled'
          ? formatBitgetEarn(bitgetData.value, tokens)
          : []),
        ...(bybitData.status === 'fulfilled'
          ? formatBybitEarn(bybitData.value, tokens)
          : []),
        // ...(bingXData.status === 'fulfilled'
        //   ? formatBingXEarn(bingXData.value)
        //   : []),
        ...(mexcData.status === 'fulfilled'
          ? formatMexcEarn(mexcData.value, tokens)
          : []),
        ...(sparkData.status === 'fulfilled'
          ? formatSparkEarn(sparkData.value, tokens)
          : []),
        ...(lidoData.status === 'fulfilled'
          ? formatLidoEarn(lidoData.value as LidoEarnDto[], tokens)
          : []),
        ...(venusData.status === 'fulfilled'
          ? formatVenusEarn(venusData.value, tokens)
          : []),
        // Стремная история, нет нормального апи для earn
        // ...(naviData.status === 'fulfilled'
        //   ? formatNaviEarn(naviData.value, tokens)
        //   : []),
        ...(jitoData.status === 'fulfilled'
          ? formatJitoEarn(jitoData.value, tokens)
          : []),
      ] as EarnItemDto[];

      const meta = await this.collectMeta(earnItems);

      return {
        data: earnItems,
        meta,
        pagination: {
          total: earnItems.length,
        },
      };
    } catch (error) {
      console.error('Error fetching earn items:', error);
      return {
        data: [],
        meta: DEFAULT_META,
        pagination: {
          total: 0,
        },
      };
    }
  }

  async getEarnItems(query: EarnRequest): Promise<EarnResponseDto> {
    // const isHasCustomQuery = !isEqual(query, {
    //   sort: { field: 'maxRate', direction: 'desc' },
    //   limit: '40',
    //   skip: '0',
    // });

    // const channel = 'seo';
    // const byPosition = 'seoPosition';
    // const redisKey = `earn:${channel}${byPosition}`;

    // if (!isHasCustomQuery) {
    //   const cachedData = await this.redisService.get(redisKey);

    //   if (cachedData) {
    //     return JSON.parse(cachedData) as EarnResponseDto;
    //   }
    // }

    try {
      const [earnItems, meta] = await Promise.all([
        this.earnRepository.findBy(query),
        this.earnMetaRepository.find(),
      ]);

      if (
        !earnItems?.data?.length &&
        !Object.keys(query?.filter || {}).length
      ) {
        await this.smartUpdateEarnItemsInDb();
        const [data, meta] = await Promise.all([
          this.earnRepository.findBy(query),
          this.earnMetaRepository.find(),
        ]);

        return {
          data: data.data,
          meta,
          pagination: {
            total: data.total,
          },
        };
      }

      // if (!isHasCustomQuery) {
      //   await this.redisService.set(
      //     redisKey,
      //     JSON.stringify({
      //       data: earnItems.data,
      //       meta,
      //       pagination: {
      //         total: earnItems.total,
      //       },
      //     }),
      //   );
      // }

      return {
        data: earnItems.data,
        meta,
        pagination: {
          total: earnItems.total,
        },
      };
    } catch (e: any) {
      this.logger.error(`Не удалось получить Earn, ${e?.message}`);

      return {
        data: [],
        meta: DEFAULT_META,
        pagination: {
          total: 0,
        },
      };
    }
  }

  /** @deprecated use smartUpdateEarnItemsInDb instead */
  async saveEarnItemsInDb() {
    const earnData = await this.fetchEarnItems();
    await this.earnRepository.saveMany(earnData.data);

    const meta = await this.collectMeta(earnData.data);
    await this.earnMetaRepository.replace(meta);

    return earnData;
  }

  async smartUpdateEarnItemsInDb() {
    const earnData = await this.fetchEarnItems();
    await this.earnRepository.smartUpdate(earnData.data);

    const meta = await this.collectMeta(earnData.data);
    await this.earnMetaRepository.replace(meta);

    return earnData;
  }

  async updateEarnItemsInwqeDb() {
    await this.earnRepository.updatePositions();
  }

  private async collectMeta(data?: EarnItemDto[]): Promise<EarnMetaDto> {
    if (!data) {
      data = await this.earnRepository.findAll();
    }

    const meta = data.reduce(
      (acc, item) => {
        acc.platforms.add(item.platform.name);
        acc.tokens[item.token.name] = item.token;
        acc.totalItems++;
        return acc;
      },
      {
        platforms: new Set(),
        totalItems: 0,
        tokens: {},
      },
    );

    return {
      ...meta,
      platforms: Array.from(meta.platforms) as string[],
      tokens: Object.values(meta.tokens),
    };
  }

  getPagesSettings(): PagesSettingsDto {
    return {
      data: earnRoutes,
    };
  }
}
