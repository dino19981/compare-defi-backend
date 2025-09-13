import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PoolItemTokenDto } from './dtos/lendingToken.dto';

export type LendingDocument = LendingEntity & { _id: Types.ObjectId };

@Schema({ collection: 'lendings_data' })
export class LendingEntity {
  @Prop({ type: Object, required: true })
  firstToken: PoolItemTokenDto;

  @Prop({ type: Object, required: true })
  secondToken: PoolItemTokenDto;

  @Prop({ type: String, required: true })
  tvl: string;

  @Prop({ type: String, required: true })
  volume: string;

  @Prop({ type: String, required: true })
  fee: string;

  @Prop({ type: Number, required: true })
  apr: number;

  @Prop({ type: [String], default: [] })
  badges?: string[];
}

export const LendingSchema = SchemaFactory.createForClass(LendingEntity);

// Создаем индексы для оптимизации поиска
LendingSchema.index({ 'firstToken.name': 1 });
LendingSchema.index({ 'secondToken.name': 1 });
LendingSchema.index({ apr: -1 });
LendingSchema.index({ tvl: -1 });
