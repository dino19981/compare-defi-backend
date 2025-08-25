import { config } from 'dotenv';

// Загружаем переменные окружения из .env файла
config();

// Экспортируем переменные окружения
export const env = {
  // Порт сервера
  PORT: process.env.PORT || '3010',

  // Binance API
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,

  // Bybit API
  BYBIT_API_KEY: process.env.BYBIT_API_KEY,
  BYBIT_SECRET_KEY: process.env.BYBIT_SECRET_KEY,

  // Bitget API
  BITGET_API_KEY: process.env.BITGET_API_KEY,
  BITGET_SECRET_KEY: process.env.BITGET_SECRET_KEY,
  BITGET_PASS: process.env.BITGET_PASS,

  // OKX API
  OKX_API_KEY: process.env.OKX_API_KEY,
  OKX_SECRET_KEY: process.env.OKX_SECRET_KEY,
  OKX_PASS: process.env.OKX_PASS,

  // PostgreSQL Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_NAME: process.env.DB_NAME || 'compare_defi_db',
  DB_USER: process.env.DB_USER || 'compare_defi_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'compare_defi_password',
};

export default env;
