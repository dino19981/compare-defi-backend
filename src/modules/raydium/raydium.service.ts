import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { getPoolsError } from 'src/helpers/pools';
import { RaydiumPoolsResponse } from './types/RaydiumPool.dto';

@Injectable()
export class RaydiumService {
  private baseUrl: string = 'https://api-v3.raydium.io';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(RaydiumService.name);

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
      const response = await firstValueFrom(
        this.httpService.get<RaydiumPoolsResponse>(
          this.baseUrl + '/pools/info/list-v2',
          {
            params: {
              sortType: 'desc',
              size: 1000,
            },
            headers: {
              // Host: 'raydium.io',
              referer: 'https://raydium.io/',
            },
          },
        ),
      );

      console.log(response, 'wqeqweqweqw');

      return response.data.data.data;
    } catch (error: unknown) {
      this.logger.error(getPoolsError(error, 'raydium'));
      return [];
    }
  }
}
