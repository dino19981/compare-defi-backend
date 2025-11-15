import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { appConfig } from 'src/configs';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://${appConfig.redis.host}:${appConfig.redis.port}`,
      password: appConfig.redis.password,
      database: 1,
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis error: ${err.message}`, err.stack);
    });

    this.client.on('connect', () => {
      this.logger.log(
        `Connecting to Redis instance: ${appConfig.redis.host}:${appConfig.redis.port}`,
      );
    });

    this.client.on('ready', () => {
      this.logger.log(
        `Redis ready: ${appConfig.redis.host}:${appConfig.redis.port}`,
      );
    });
  }

  async onModuleInit() {
    if (appConfig.redis.host && appConfig.redis.port) {
      try {
        await this.client.connect();
        this.logger.log('Redis подключен успешно');
      } catch (error) {
        this.logger.error(`Ошибка подключения к Redis: ${error.message}`);
        throw error;
      }
    } else {
      this.logger.warn('Redis конфигурация не найдена, пропускаем подключение');
    }
  }

  onModuleDestroy() {
    try {
      this.client.destroy();
      this.logger.log('Redis отключен');
    } catch (error) {
      this.logger.error(`Ошибка при отключении Redis: ${error.message}`);
    }
  }

  async set(key: string, value: string | number, ex?: number): Promise<any> {
    console.log('set to redis', key);
    return ex
      ? this.client.multi().set(key, value).expire(key, ex).exec()
      : this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    console.log('get from redis', key);
    return this.client.get(key);
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
