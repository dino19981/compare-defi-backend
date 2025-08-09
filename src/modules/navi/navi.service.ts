import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NaviEarnDto, NaviEarnItemDto } from './types';
import { firstValueFrom } from 'rxjs';
import { getEarnError } from 'src/helpers/earn';

@Injectable()
export class NaviService {
  private readonly url = 'https://open-api.naviprotocol.io/api/navi/pools';
  private readonly logger = new Logger(NaviService.name);

  constructor(private readonly httpService: HttpService) {}

  async getPools(): Promise<NaviEarnItemDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<NaviEarnDto>(this.url, {
          headers: {
            Accept: 'application/json',
          },
        }),
      );
      return response.data.data;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'navi'));
      return [];
    }
  }
}
