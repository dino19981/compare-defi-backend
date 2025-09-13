import { MongooseModuleOptions } from '@nestjs/mongoose';
import { env } from './env.config';

export const databaseConfig: MongooseModuleOptions = {
  uri: `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  retryWrites: true,
  w: 'majority',
  retryReads: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
};

export default databaseConfig;
