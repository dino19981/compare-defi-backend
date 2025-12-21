import * as dotenv from 'dotenv';
import type { TConfig } from './type';

dotenv.config();

export const config = (): TConfig => {
  return {
    port: Number(process.env.PORT) || 3010,
    globalPrefix: process.env.GLOBAL_PREFIX || '',
    env: process.env.NODE_ENV || 'development',

    swagger: {
      title: 'Compare DeFi API',
      description: 'API для сравнения DeFi протоколов и стейкинга',
      version: '1.0',
    },

    mongo: {
      uri: process.env.MONGO_URI,
    },

    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },

    exchanges: {
      binance: {
        apiKey: process.env.BINANCE_API_KEY,
        secretKey: process.env.BINANCE_SECRET_KEY,
      },
      bybit: {
        apiKey: process.env.BYBIT_API_KEY,
        secretKey: process.env.BYBIT_SECRET_KEY,
      },
      bitget: {
        apiKey: process.env.BITGET_API_KEY,
        secretKey: process.env.BITGET_SECRET_KEY,
        passphrase: process.env.BITGET_PASS,
      },
      okx: {
        apiKey: process.env.OKX_API_KEY,
        secretKey: process.env.OKX_SECRET_KEY,
        passphrase: process.env.OKX_PASS,
      },
      htx: {
        apiKey: process.env.HTX_API_KEY,
        secretKey: process.env.HTX_SECRET_KEY,
      },
      kucoin: {
        apiKey: process.env.KUCOIN_API_KEY,
        secretKey: process.env.KUCOIN_SECRET_KEY,
        passphrase: process.env.KUCOIN_PASS,
      },
      bingx: {
        apiKey: process.env.BINGX_API_KEY,
        secretKey: process.env.BINGX_SECRET_KEY,
      },
    },
  };
};

export const appConfig = config();
