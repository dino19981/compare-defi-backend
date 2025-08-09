import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VenusEarnDto, VenusEarnItemDto } from './types';
import { firstValueFrom } from 'rxjs';
import { getEarnError } from 'src/helpers/earn';

// Работает только с впн
@Injectable()
export class VenusService {
  private readonly url = 'https://api.venus.io/pools?chainId=56';
  private readonly logger = new Logger(VenusService.name);

  constructor(private readonly httpService: HttpService) {}

  async getPools(): Promise<VenusEarnItemDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<VenusEarnDto>(this.url, {
          headers: {
            Accept: 'application/json',
          },
        }),
      );
      return response.data.result;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'venus'));
      return [];
    }
  }
}
