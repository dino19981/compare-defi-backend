import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { UniSwapPoolsDto } from './types';
import { getPoolsError } from 'src/helpers/pools';

@Injectable()
export class UniSwapService {
  private baseUrl: string =
    'https://interface.gateway.uniswap.org/v2/uniswap.explore.v1.ExploreStatsService/ExploreStats?connect=v1&encoding=json&message=%7B%22chainId%22%3A%22ALL_NETWORKS%22%7D';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(UniSwapService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        baseURL: this.baseUrl,
        timeout: 5000,
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
      const response = await firstValueFrom(
        this.httpService.get<UniSwapPoolsDto>('', {
          headers: {
            origin: 'https://app.uniswap.org/',
            referer: 'https://app.uniswap.org/',
          },
        }),
      );

      return response.data.stats.poolStats;
    } catch (error: unknown) {
      this.logger.error(getPoolsError(error, 'uniswap'));
      return [];
    }
  }
}
