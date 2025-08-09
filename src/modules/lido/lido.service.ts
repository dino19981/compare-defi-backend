import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LidoAprDto, LidoEarnDto } from './types/lidoEarnDto';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { MellowAprDto } from './types';

@Injectable()
export class LidoService {
  private baseUrl: string = 'https://eth-api.lido.fi/v1/protocol/steth';
  private readonly httpService: HttpService;

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

  async getApr(): Promise<{ name: string; apr: number; link: string }[]> {
    const [lidoResponse, mellowResponse] = await Promise.all([
      firstValueFrom(
        this.httpService.get<LidoEarnDto>('/apr/sma', {
          headers: {
            'User-Agent': 'PostmanRuntime/7.44.1',
          },
        }),
      ),
      axios.get<MellowAprDto[]>('https://points.mellow.finance/v1/vaults', {
        headers: {
          'User-Agent': 'PostmanRuntime/7.44.1',
        },
      }),
    ]);

    const lidoData = lidoResponse.data.data.aprs.at(-1) as LidoAprDto;
    const mellowData = mellowResponse.data.find(
      (item) => item.id === 'ethereum-dvsteth',
    );

    return [
      {
        name: 'Lido',
        apr: lidoData.apr,
        link: 'https://stake.lido.fi/',
      },
      ...(mellowData
        ? [
            {
              name: 'Mellow',
              apr: mellowData.apr,
              link: 'https://app.mellow.finance/vaults/ethereum-dvsteth',
            },
          ]
        : []),
    ] as { name: string; apr: number; link: string }[];
  }
}
