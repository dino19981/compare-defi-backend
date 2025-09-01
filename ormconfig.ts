import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { EarnEntity } from './src/modules-api/earn/earn.entity';
import { PoolEntity } from './src/modules-api/pools/pools.entity';

// Загружаем переменные окружения
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'compare_defi_user',
  password: process.env.DB_PASSWORD || 'compare_defi_password',
  database: process.env.DB_NAME || 'compare_defi_db',
  entities: [EarnEntity, PoolEntity],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  // logging: process.env.NODE_ENV !== 'production',
  logging: false, // Отключаем логирование SQL запросов
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
