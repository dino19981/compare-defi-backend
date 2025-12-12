import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NaviEarnDto, NaviEarnItemDto, NaviLandingDto } from './types';
import { firstValueFrom } from 'rxjs';
import { getEarnError } from 'src/helpers/earn';

const landingUrl = 'https://open-api.naviprotocol.io/api/navi/pools';
const earnsUrl = 'https://vault-api.volosui.com/api/v1/vaults';

@Injectable()
export class NaviService {
  private readonly logger = new Logger(NaviService.name);

  constructor(private readonly httpService: HttpService) {}

  async getEarnItems(): Promise<NaviEarnItemDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<NaviEarnDto>(earnsUrl, {
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

  async getLandingItems() {
    try {
      const response = await firstValueFrom(
        this.httpService.get<NaviLandingDto>(landingUrl, {
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
