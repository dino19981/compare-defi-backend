import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

async function createIndexes() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Получаем модели
    const lendingModel = app.get<Model<any>>(getModelToken('LendingEntity'));
    const poolModel = app.get<Model<any>>(getModelToken('PoolEntity'));
    const earnModel = app.get<Model<any>>(getModelToken('EarnEntity'));

    console.log('Создание индексов для MongoDB...');

    // Создаем индексы для LendingEntity
    await lendingModel.collection.createIndex({ 'firstToken.name': 1 });
    await lendingModel.collection.createIndex({ 'secondToken.name': 1 });
    await lendingModel.collection.createIndex({ apr: -1 });
    await lendingModel.collection.createIndex({ tvl: -1 });
    console.log('✅ Индексы для LendingEntity созданы');

    // Создаем индексы для PoolEntity
    await poolModel.collection.createIndex({ 'firstToken.name': 1 });
    await poolModel.collection.createIndex({ 'secondToken.name': 1 });
    await poolModel.collection.createIndex({ 'chain.name': 1 });
    await poolModel.collection.createIndex({ 'platform.name': 1 });
    await poolModel.collection.createIndex({ apr: -1 });
    await poolModel.collection.createIndex({ tvl: -1 });
    console.log('✅ Индексы для PoolEntity созданы');

    // Создаем индексы для EarnEntity
    await earnModel.collection.createIndex({
      'platform.name': 1,
      maxRate: -1,
      'token.name': 1,
    });
    await earnModel.collection.createIndex({ 'token.name': 1 });
    await earnModel.collection.createIndex({ 'platform.name': 1 });
    await earnModel.collection.createIndex({ maxRate: -1 });
    await earnModel.collection.createIndex({ periodType: 1 });
    console.log('✅ Индексы для EarnEntity созданы');

    console.log('🎉 Все индексы успешно созданы!');
  } catch (error) {
    console.error('❌ Ошибка при создании индексов:', error);
  } finally {
    await app.close();
  }
}

createIndexes();
