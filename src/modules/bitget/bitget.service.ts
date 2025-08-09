import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { BitgetEarnsDto } from './types';
import * as crypto from 'crypto';
import { getEarnError } from 'src/helpers/earn';
import { config } from 'src/configs';

@Injectable()
export class BitgetService {
  private baseUrl: string = 'https://api.bitget.com';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(BitgetService.name);
  private readonly appConfig = config();
  private earnEndpoint: string =
    '/api/v2/earn/savings/product?filter=available';

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

  async getEarnItems() {
    try {
      // https://www.bitget.com/api-doc/earn/savings/Savings-Products
      const response = await firstValueFrom(
        this.httpService.get<BitgetEarnsDto>(this.earnEndpoint, {
          headers: this.getHeaders(),
        }),
      );

      return response.data.data;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'bitget'));
      return [];
    }
  }

  private getHeaders = () => {
    const timestamp = Date.now().toString();
    const message = timestamp + 'GET' + this.earnEndpoint;
    const signature = crypto
      .createHmac('sha256', this.appConfig.exchanges.bitget.secretKey!)
      .update(message)
      .digest('base64');

    return {
      'ACCESS-KEY': this.appConfig.exchanges.bitget.apiKey,
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': this.appConfig.exchanges.bitget.passphrase,
      'Content-Type': 'application/json',
    };
  };
}
