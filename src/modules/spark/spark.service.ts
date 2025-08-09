import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SparkEarnDto } from './types';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class SparkService {
  private baseUrl: string = 'https://info-sky.blockanalitica.com/api/v1';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(SparkService.name);

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

  async getSavingsRates(): Promise<SparkEarnDto | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SparkEarnDto[]>('/savings-rate/', {
          headers: {
            'User-Agent': 'PostmanRuntime/7.44.1',
          },
        }),
      );

      return response.data[0];
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'spark'));
      return null;
    }
  }
}
