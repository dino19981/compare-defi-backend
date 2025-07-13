import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { OkxEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class OkxService {
  private baseUrl: string = 'https://www.okx.com';
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
      const url = `/priapi/v1/earn/simple-earn/all-products?type=all&t=${Date.now().valueOf()}`;

      const response = await firstValueFrom(
        this.httpService.get<OkxEarnsDto>(url),
      );

      return response.data.data.allProducts.currencies;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'okx'));
      return [];
    }
  }
}
