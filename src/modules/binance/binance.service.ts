import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { BinanceEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';
import { config } from 'src/configs';

@Injectable()
export class BinanceService {
  private baseUrl: string = 'https://www.binance.com/bapi';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(BinanceService.name);
  private readonly appConfig = config();

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
          'X-MBX-APIKEY': this.appConfig.exchanges.binance.apiKey,
        },
      }),
    );
  }

  async getEarnItems() {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BinanceEarnsDto>(
          '/earn/v1/friendly/finance-earn/homepage/overview?pageSize=100',
        ),
      );

      return response.data.data.list;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'binance'));
      return [];
    }
  }
}
