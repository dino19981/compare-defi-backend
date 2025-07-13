import * as crypto from 'crypto';
import { BingXSignatureParams } from '../types/bingXConfig';

export class BingXSignatureHelper {
  /**
   * Генерирует подпись для запроса к BingX API
   * @param params - параметры запроса
   * @param secretKey - секретный ключ
   * @returns подпись в формате hex
   */
  static generateSignature(
    params: BingXSignatureParams,
    secretKey: string,
  ): string {
    // Сортируем параметры по алфавиту
    const sortedParams = Object.keys(params)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = params[key];
          return acc;
        },
        {} as Record<string, string | number>,
      );

    // Создаем строку запроса
    const queryString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&');

    // Добавляем секретный ключ в конец строки
    const stringToSign = queryString + secretKey;

    // Создаем HMAC-SHA256 подпись
    const signature = crypto
      .createHmac('sha256', '')
      .update(stringToSign)
      .digest('hex')
      .toUpperCase();

    return signature;
  }

  /**
   * Создает параметры запроса с обязательными полями
   * @param apiKey - API ключ
   * @param additionalParams - дополнительные параметры
   * @returns объект с параметрами для подписи
   */
  static createSignatureParams(
    apiKey: string,
    additionalParams: BingXSignatureParams = {},
  ): BingXSignatureParams {
    const timestamp = Date.now();

    return {
      apiKey,
      timestamp,
      ...additionalParams,
    };
  }
}
