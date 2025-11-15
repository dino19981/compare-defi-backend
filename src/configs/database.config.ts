import { MongooseModuleOptions } from '@nestjs/mongoose';
import { appConfig } from '.';

export const databaseConfig: MongooseModuleOptions = {
  uri: appConfig.mongo.uri,
  retryWrites: true,
  w: 'majority',
  retryReads: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
};

export default databaseConfig;
