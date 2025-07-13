export interface BingXConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

export interface BingXSignatureParams {
  [key: string]: string | number;
}
