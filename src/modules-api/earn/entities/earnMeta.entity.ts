import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EarnMetaTokenDto } from '../dtos/EarnMeta.dto';

@Schema({ collection: 'earn_meta' })
export class EarnMetaEntity {
  @Prop({ type: Array, required: true })
  platforms: string[];

  @Prop({ type: Number, required: true })
  totalItems: number;

  @Prop({ type: Array, required: true })
  tokens: EarnMetaTokenDto[];
}

export type EarnMetaDocument = EarnMetaEntity & { _id: Types.ObjectId };

export const EarnMetaSchema = SchemaFactory.createForClass(EarnMetaEntity);
