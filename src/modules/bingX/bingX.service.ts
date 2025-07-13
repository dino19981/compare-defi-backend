import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { BingXEarnsDto } from './types';
import { getEarnError } from 'src/helpers/earn';
// import { BingXSignatureHelper } from './helpers/signature';
import { bingXConfig } from './config/bingX.config';

@Injectable()
export class BingXService {
  private readonly httpService: HttpService;
  private readonly logger = new Logger(BingXService.name);

  constructor() {
    this.httpService = new HttpService(
      axios.create({
        baseURL: bingXConfig.baseUrl,
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
      const url = `/wealth-sales-trading/v1/product/list`;

      // Создаем параметры для подписи
      // const signatureParams = BingXSignatureHelper.createSignatureParams(
      //   bingXConfig.apiKey,
      //   {
      //     method: 'GET',
      //     path: url,
      //   },
      // );

      // Генерируем подпись
      // const signature = BingXSignatureHelper.generateSignature(
      //   signatureParams,
      //   bingXConfig.secretKey,
      // );

      const response = await firstValueFrom(
        this.httpService.get<BingXEarnsDto>(url, {
          headers: {
            referer: 'https://bingx.com/',
            reg_channel: 'official',
            sign: 'DE708DFA3C5912CB39B633D27E0C46E61FD5F86E5909C54E770A8B9413BC0B0F',
            platformid: 30,
            lang: 'en',
            device_id: '01555455c7924d49a634c3b301d59df6',
            app_version: '5.2.9',
            traceid: 'f4bea8cfb3d84a41a57240b5087392b5',
            timestamp: new Date().valueOf(),
          },
        }),
      );

      return response.data.data;
    } catch (error: unknown) {
      this.logger.error(getEarnError(error, 'bingX'));
      return [];
    }
  }
}
