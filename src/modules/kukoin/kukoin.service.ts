import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { KucoinEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class KukoinService {
  private baseUrl: string = 'https://www.kucoin.com';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(KukoinService.name);

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
      const url = `/_pxapi/pool-staking/v4/low-risk/currencies-products`;

      const response = await firstValueFrom(
        this.httpService.get<KucoinEarnsDto>(url),
      );

      return response.data.data;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'kukoin'));
      return [];
    }
  }
}
