import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { PancakeSwapPoolsDto } from './types';
import { getPoolsError } from 'src/helpers/pools';

@Injectable()
export class PancakeSwapService {
  private baseUrl: string = 'https://pancakeswap.finance/api';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(PancakeSwapService.name);

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
      const url = `/farm/list`;

      const response = await firstValueFrom(
        this.httpService.get<PancakeSwapPoolsDto>(url),
      );

      return response.data.data;
    } catch (error: unknown) {
      this.logger.error(getPoolsError(error, 'uniswap'));

      return [];
    }
  }
}
