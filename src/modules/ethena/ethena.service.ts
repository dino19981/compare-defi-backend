import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EthenaEarnDto } from './types/ethenaEarnDto';
import { firstValueFrom } from 'rxjs';

// @нужно ли это? оно работает только с впн
@Injectable()
export class EthenaService {
  private readonly url =
    'https://app.ethena.fi/api/yields/protocol-and-staking-yield';

  constructor(private readonly httpService: HttpService) {}

  async getYields(): Promise<EthenaEarnDto> {
    const response = await firstValueFrom(
      this.httpService.get<EthenaEarnDto>(this.url, {
        headers: {
          Accept: 'application/json',
        },
      }),
    );
    return response.data;
  }
}
