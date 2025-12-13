import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { MexcEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class MexcService {
  private baseUrl: string = 'https://www.mexc.com/api';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(MexcService.name);

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
      const response = await firstValueFrom(
        this.httpService.get<MexcEarnsDto>(
          '/financialactivity/financial/products/list/V2?',
          {
            headers: {
              'User-Agent': 'PostmanRuntime/7.44.1',
            },
          },
        ),
      );

      return response.data.data || [];
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'mexc'));
      return [];
    }
  }
}
