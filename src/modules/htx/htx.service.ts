import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { HtxEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class HtxService {
  private baseUrl: string = 'https://www.htx.com';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(HtxService.name);

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
      const url = `/-/x/hbg/v4/saving/mining/home?r=n3x9tg&x-b3-traceid=07d0c6cae296c2907a67dc05c88c84db`;

      const response = await firstValueFrom(
        this.httpService.get<HtxEarnsDto>(url),
      );

      return response.data.data.recommendProject;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'htx'));
      return [];
    }
  }
}
