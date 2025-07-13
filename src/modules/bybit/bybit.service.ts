import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { BybitEarnsDto } from './types';
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
}
