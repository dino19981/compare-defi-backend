import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SeoByLanguageDto } from './dtos/seo.dto';

@Schema({ collection: 'seo' })
export class SeoEntity {
  @Prop({ type: String, required: true, unique: true })
  pathname: string;

  @Prop({ type: Object, required: true })
  data: SeoByLanguageDto;
}

export const SeoSchema = SchemaFactory.createForClass(SeoEntity);

export type SeoDocument = SeoEntity & { _id: Types.ObjectId };

SeoSchema.index({ pathname: 1 });
