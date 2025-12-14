import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TokenModel } from './types/TokensDto';
import { CoinGeckoTokenDto } from './types';
import { TokensRepository } from './tokens.repository';
import { formatCoingeckoTokens } from './formatters';
import { sleep } from 'src/shared/helpers/sleep';

@Injectable()
export class TokensService {
  private baseUrl: string = 'https://api.coingecko.com/api/v3';
  private readonly httpService: HttpService;
  private readonly logger = new Logger(TokensService.name);
  private readonly pagesCount = 76;
  private readonly sleepTime = 1000 * 60;
  private readonly batchSize = 5;

  constructor(private readonly tokensRepository: TokensRepository) {
    this.httpService = new HttpService(
      axios.create({
        baseURL: this.baseUrl,
        timeout: 5000,
        responseType: 'json',
      }),
    );
  }

  async getAllTokens() {
    const tokens = await this.tokensRepository.findAll();
    return tokens;
  }

  async getTokensBy(symbols: string[]) {
    const tokens = await this.tokensRepository.findBy(symbols);
    return tokens;
  }

  async saveTokens() {
    const newTokens = await this.fetchTokens();

    if (newTokens.length) {
      await this.tokensRepository.replaceMany(newTokens);
    }

    return newTokens;
  }

  private async fetchTokens(): Promise<TokenModel[]> {
    try {
      const [coinGeckoTokens] = await Promise.allSettled([
        this.getTokensCoinGecko(),
      ]);

      return [
        ...(coinGeckoTokens.status === 'fulfilled'
          ? formatCoingeckoTokens(coinGeckoTokens.value)
          : []),
      ];
    } catch (error: unknown) {
      this.logger.error('Не удалось получить монеты', error);
      return [];
    }
  }

  private async getTokensCoinGecko(): Promise<CoinGeckoTokenDto[]> {
    try {
      const result: CoinGeckoTokenDto[] = [];

      for (let i = 0; i < this.pagesCount; i += this.batchSize) {
        const tokens = await this.getTokensFromCoinGeckoBatch(
          i,
          this.batchSize,
        );
        result.push(...tokens);
        await sleep(this.sleepTime);
      }

      this.logger.log(`Получено токенов CoinGecko: ${result.length}`);

      return result;
    } catch (error: unknown) {
      this.logger.error('Не удалось получить токены CoinGecko', error);

      return [];
    }
  }

  private async getTokensFromCoinGeckoBatch(page: number, batchSize: number) {
    try {
      this.logger.log(
        `Получаем токены CoinGecko для страницы ${page}, batchSize: ${batchSize}`,
      );

      const response = await Promise.allSettled(
        Array.from({ length: batchSize }, (_, index) =>
          axios<CoinGeckoTokenDto[]>(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page + index}`,
          ),
        ),
      );

      return response.flatMap((item, index) => {
        if (item.status === 'fulfilled') {
          return item.value.data;
        }

        this.logger.error(
          `Не удалось получить токены CoinGecko для страницы ${page + index}`,
          item.reason,
        );

        return [];
      });
    } catch (error: unknown) {
      this.logger.error(
        `Не удалось получить токены CoinGecko, page: ${page}, batchSize: ${batchSize}`,
        error,
      );

      return [];
    }
  }
}
