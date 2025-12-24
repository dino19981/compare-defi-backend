import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PoolMetaTokenDto } from '../dtos/poolMeta.dto';

@Schema({ collection: 'pools_meta' })
export class PoolsMetaEntity {
  @Prop({ type: Array, required: true })
  platforms: string[];

  @Prop({ type: Number, required: true })
  totalItems: number;

  @Prop({ type: Array, required: true })
  tokens: PoolMetaTokenDto[];
}

export type PoolsMetaDocument = PoolsMetaEntity & { _id: Types.ObjectId };

export const PoolsMetaSchema = SchemaFactory.createForClass(PoolsMetaEntity);
