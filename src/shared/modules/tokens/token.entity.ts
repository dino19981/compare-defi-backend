import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type TokenDocument = TokenEntity & { _id: Types.ObjectId };

@Schema({ collection: 'tokens' })
export class TokenEntity {
  @Prop({ type: String, required: true, index: true })
  symbol: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  image: string;
}

export const TokenSchema = SchemaFactory.createForClass(TokenEntity);
