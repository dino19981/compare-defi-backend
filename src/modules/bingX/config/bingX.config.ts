import { BingXConfig } from '../types/bingXConfig';

export const bingXConfig: BingXConfig = {
  apiKey: process.env.BINGX_API_KEY || '',
  secretKey: process.env.BINGX_SECRET_KEY || '',
  baseUrl: 'https://api-app.we-api.com/api',
};
