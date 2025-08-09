import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { BingXEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class BingXService {
  private readonly httpService: HttpService;
  private readonly logger = new Logger(BingXService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        // baseURL: 'https://api-app.acc-de.com/api',
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
      const url = `https://api-app.acc-de.com/api/wealth-sales-trading/v1/product/list?searchType=&dataType=&assetName=&orderBy=`;

      const response = await firstValueFrom(
        this.httpService.get<BingXEarnsDto>(url, {
          headers: {
            app_version: '5.2.11',
            device_id: '01555455c7924d49a634c3b301d59df6',
            lang: 'ru-RU',
            platformid: '30',
            sign: 'E3524DD3BB7AD59EA82E7F84C0E79F633FD5E002295E5392D4CDAC8CB094C34B',
            traceid: 'cfa2b1ff168e409597cef8f7272e2f66',
            timestamp: '1752862446401',
          },
        }),
      );

      return response.data.data.result;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'bingX'));
      return [];
    }
  }
}
