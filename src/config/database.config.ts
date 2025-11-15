import { MongooseModuleOptions } from '@nestjs/mongoose';
import { env } from './env.config';

export const databaseConfig: MongooseModuleOptions = {
  uri: env.MONGO_URI,
  retryWrites: true,
  w: 'majority',
  retryReads: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
};

export default databaseConfig;
