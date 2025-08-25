import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { Chain, ChainDto, Chains } from './types';
import { getEarnError } from 'src/helpers/earn';
import { keyBy } from 'lodash';

@Injectable()
export class ChainsService {
  private baseUrl: string = 'https://api.coingecko.com/api/v3';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(ChainsService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        baseURL: this.baseUrl,
        timeout: 5000,
        responseType: 'json',
      }),
    );
  }

  async getChains(): Promise<Chains> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ChainDto[]>('/asset_platforms'),
      );

      return this.formatChains(response.data);
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'chains'));
      return {
        chainById: {},
        chainByName: {},
      };
    }
  }

  private formatChains(chains: ChainDto[]): Chains {
    const filteredChains = chains.filter(
      (chain) => chain.chain_identifier !== null,
    ) as Chain[];

    return {
      chainById: keyBy(filteredChains, 'chain_identifier'),
      chainByName: filteredChains.reduce(
        (acc, chain) => {
          acc[
            chain.shortname
              ? chain.shortname.toLowerCase()
              : chain.name.toLowerCase()
          ] = chain;
          return acc;
        },
        {} as Record<string, Chain>,
      ),
    };
  }
}
