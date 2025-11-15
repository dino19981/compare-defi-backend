import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { OkxEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class OkxService {
  private baseUrl: string = 'https://www.okx.com/priapi';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(OkxService.name);

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
      const url = `v1/earn/currency?t=${Date.now().valueOf()}`;

      const response = await firstValueFrom(
        this.httpService.get<OkxEarnsDto>(url, {
          headers: {
            'x-site-info':
              '==QfxojI5RXa05WZiwiIMFkQPx0Rfh1SPJiOiUGZvNmIsICTOJiOi42bpdWZyJye',
          },
        }),
      );

      console.log(response.data.data.currencies.length, 'wqeqweqweqwewqeqw');

      return response.data.data.currencies;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'okx'));
      return [];
    }
  }
}
