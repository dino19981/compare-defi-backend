export type TConfig = {
  port: number;
  swagger: {
    title: string;
    description: string;
    version: string;
  };
  mongo: {
    uri?: string;
  };
  redis: {
    host?: string;
    port?: number;
    password?: string;
  };
  exchanges: {
    binance: {
      apiKey?: string;
      secretKey?: string;
    };
    bybit: {
      apiKey?: string;
      secretKey?: string;
    };
    bitget: {
      apiKey?: string;
      secretKey?: string;
      passphrase?: string;
    };
    okx: {
      apiKey?: string;
      secretKey?: string;
      passphrase?: string;
    };
    htx: {
      apiKey?: string;
      secretKey?: string;
    };
    kucoin: {
      apiKey?: string;
      secretKey?: string;
      passphrase?: string;
    };
    bingx: {
      apiKey?: string;
      secretKey?: string;
    };
  };
};
