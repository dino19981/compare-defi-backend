import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  PancakeSwapPoolDto,
  PancakeSwapTokenDto,
  PancakeSwapTokensDto,
  PancakeSwapPoolConfigDto,
  PancakeSwapPoolTokenConfigs,
} from './types';
import { getPoolsError } from 'src/helpers/pools';
import { pancakeSwapChains } from './constants/pancakeSwapChains';

@Injectable()
export class PancakeSwapService {
  private baseUrl: string = 'https://explorer.pancakeswap.com/api/cached';
  // private baseUrl: string = 'https://pancakeswap.finance/api';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(PancakeSwapService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        baseURL: this.baseUrl,
        timeout: 25000,
        responseType: 'json',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    );
  }

  async getPoolsItems() {
    try {
      const url = `/pools/farming`;
      const response = await firstValueFrom(
        this.httpService.get<PancakeSwapPoolDto[]>(url, {
          params: {
            // orderBy: 'volumeUSD24h',
            protocols: 'v2,v3,stable,infinityBin,infinityCl',
            chains:
              'bsc,ethereum,base,opbnb,zksync,polygon-zkevm,linea,arbitrum',
            // limit: 10000,
          },
        }),
      );

      return response.data;
    } catch (error: unknown) {
      this.logger.error(getPoolsError(error, 'pancakeSwap'));

      return [];
    }
  }

  async getPoolsItemsConfig() {
    try {
      const response = await Promise.allSettled(
        pancakeSwapChains.map((chainId) =>
          axios<PancakeSwapPoolConfigDto[]>(
            `https://configs.pancakeswap.com/api/data/cached/farms?chainId=${chainId}`,
          ),
        ),
      );

      const tokenConfigBySymbol: PancakeSwapPoolTokenConfigs = {};

      response.forEach((item) => {
        if (item.status === 'fulfilled') {
          item.value.data.forEach((item) => {
            if (!tokenConfigBySymbol[item.token0.symbol.toLowerCase()]) {
              tokenConfigBySymbol[item.token0.symbol.toLowerCase()] =
                item.token0;
            }
            if (!tokenConfigBySymbol[item.token1.symbol.toLowerCase()]) {
              tokenConfigBySymbol[item.token1.symbol.toLowerCase()] =
                item.token1;
            }
          });
        }
      });

      return tokenConfigBySymbol;
    } catch (error: unknown) {
      this.logger.error(getPoolsError(error, 'pancakeSwap'));

      return {};
    }
  }

  async getTokens(): Promise<PancakeSwapTokenDto[]> {
    try {
      const url =
        'https://tokens.pancakeswap.finance/pancakeswap-extended.json';

      const response = await firstValueFrom(
        this.httpService.get<PancakeSwapTokensDto>(url),
      );

      return response.data.tokens;
    } catch (error: unknown) {
      this.logger.error(`Не удалось получить токены pancakeswap`, error);

      return [];
    }
  }
}
