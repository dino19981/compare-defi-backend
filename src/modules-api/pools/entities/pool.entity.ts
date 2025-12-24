import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PoolItemTokenDto } from '../dtos/poolItemToken.dto';
import { PoolItemPlatformDto } from '../dtos/poolItemPlatformDto.dto';
import { PoolItemBadge } from '../types';
import { ChainDto } from 'src/shared/dtos/chain.dto';
import { Types } from 'mongoose';

export type PoolDocument = PoolEntity & { _id: Types.ObjectId };

@Schema({ collection: 'pools_data' })
export class PoolEntity {
  @Prop({ type: Object, required: true })
  id: string;

  @Prop({ type: Object, required: true })
  firstToken: PoolItemTokenDto;

  @Prop({ type: Object, required: true })
  secondToken: PoolItemTokenDto;

  @Prop({ type: Object, required: true })
  chain: ChainDto;

  @Prop({ type: Object, required: true })
  platform: PoolItemPlatformDto;

  @Prop({ type: Number, required: true })
  tvl: number;

  @Prop({ type: Number, required: true })
  volume: number;

  @Prop({ type: Number, required: true })
  fee: number;

  @Prop({ type: Number, required: true })
  apr: number;

  @Prop({ type: [Object], default: [] })
  badges?: PoolItemBadge[];

  @Prop({ type: Object, required: true })
  positions: Record<string, number>;
}

export const PoolSchema = SchemaFactory.createForClass(PoolEntity);

PoolSchema.index({ 'firstToken.name': 1 });
PoolSchema.index({ 'secondToken.name': 1 });
PoolSchema.index({ 'chain.name': 1 });
PoolSchema.index({ 'platform.name': 1 });
PoolSchema.index({ apr: -1 });
PoolSchema.index({ tvl: -1 });
