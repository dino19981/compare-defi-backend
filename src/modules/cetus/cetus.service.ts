import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { getPoolsError } from 'src/helpers/pools';
import { CetusPoolsResponse } from './types/CetusEarn.dto';

@Injectable()
export class CetusService {
  private baseUrl: string = 'https://api-sui.cetus.zone/v3';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(CetusService.name);

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
        this.httpService.post<CetusPoolsResponse>(
          this.baseUrl + '/sui/clmm/stats_pools',
          {
            filter: 'verified',
            limit: 2000,
          },
        ),
      );

      return response.data.data.list;
    } catch (error: unknown) {
      this.logger.error(getPoolsError(error, 'cetus'));
      return [];
    }
  }
}
