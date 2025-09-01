import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './env.config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 10),
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Автоматическая синхронизация только в dev режиме
  // logging: process.env.NODE_ENV !== 'production', // Логирование запросов только в dev режиме
  logging: false, // Отключаем логирование SQL запросов
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  autoLoadEntities: true,
};

export default databaseConfig;
