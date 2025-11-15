import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  BybitEarnDto,
  BybitEarnsDto,
  BybitTokenDto,
  BybitTokensDto,
} from './types';
import { firstValueFrom } from 'rxjs';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class BybitService {
  private baseUrl: string = 'https://www.bybit.com';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(BybitService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        baseURL: this.baseUrl,
        timeout: 5000,
        responseType: 'json',
      }),
    );
  }

  async getEarnItems() {
    try {
      const [items, tokens] = await Promise.allSettled([
        this.fetchEarnItems(),
        this.getTokens(),
      ]);

      return this.injectTokenNames(items, tokens);
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'bybit'));

      return [];
    }
  }

  private async fetchEarnItems() {
    try {
      const data = await firstValueFrom(
        this.httpService.post<BybitEarnsDto>(
          '/x-api/s1/byfi/api/v1/get-overview-products',
          '',
          {
            headers: {
              'User-Agent': 'PostmanRuntime/7.44.1',
              Accept: 'application/json, text/plain, */*',
            },
          },
        ),
      );

      return data.data.result.coin_products;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'bybit'));

      return [];
    }
  }

  private async getTokens() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<BybitTokensDto>('/x-api/s1/byfi/get-coins', {
          headers: {
            'User-Agent': 'PostmanRuntime/7.44.1',
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
          },
        }),
      );

      return data.result.coins;
    } catch (error: unknown) {
      this.logger.error(
        `Не удалось получить токены bybit: ${error instanceof Error ? error.message : String(error)}`,
      );

      return [];
    }
  }

  private injectTokenNames(
    items: PromiseSettledResult<BybitEarnDto[]>,
    tokens: PromiseSettledResult<BybitTokenDto[]>,
  ) {
    if (items.status !== 'fulfilled' || tokens.status !== 'fulfilled') {
      return [];
    }

    const tokensByName = tokens.value.reduce(
      (acc, token) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [enumValue, tokenName, _, __, image] = token.coin || [];

        if (!enumValue || !tokenName || !image) {
          return acc;
        }

        acc[enumValue] = { name: tokenName, image };
        return acc;
      },
      {} as Record<string, { name: string; image: string }>,
    );

    return items.value.reduce((acc: BybitEarnDto[], item) => {
      if (!tokensByName[item.coin]) {
        return acc;
      }

      acc.push({
        ...item,
        tokenName: tokensByName[item.coin].name,
        tokenImage: tokensByName[item.coin].image,
      });

      return acc;
    }, []);
  }
}
