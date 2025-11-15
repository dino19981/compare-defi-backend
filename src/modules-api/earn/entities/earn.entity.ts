import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { EarnItemLevel, EarnItemBadge } from '../types/EarnItem';
import { EarnItemTokenDto } from '../dtos/EarnItemToken.dto';
import { EarnItemPlatformDto } from '../dtos/EarnItemPlatform.dto';

@Schema({ collection: 'earn_data' })
export class EarnEntity {
  @Prop({ type: Object, required: true })
  id: string;

  @Prop({ type: String, maxlength: 100 })
  name?: string;

  @Prop({ type: Object, required: true })
  token: EarnItemTokenDto;

  @Prop({
    type: String,
    enum: ['flexible', 'fixed'],
    default: 'flexible',
  })
  periodType: 'flexible' | 'fixed';

  @Prop({ type: Object, required: true })
  platform: EarnItemPlatformDto;

  @Prop({
    type: String,
    enum: EarnItemLevel,
    default: EarnItemLevel.Normal,
    required: true,
  })
  productLevel: EarnItemLevel;

  @Prop({ type: Number, required: true })
  maxRate: number;

  @Prop({ type: [Object] })
  rateSettings?: Array<{
    min: number;
    max: number | 'Infinity';
    apy: number;
  }>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  duration: number | 'Infinity';

  @Prop({ type: [String], default: [] })
  badges?: EarnItemBadge[];
}

export type EarnDocument = EarnEntity & { _id: Types.ObjectId };

export const EarnSchema = SchemaFactory.createForClass(EarnEntity);

// Создаем индексы для оптимизации поиска
EarnSchema.index({ platformName: 1, maxRate: -1, tokenName: 1 });
EarnSchema.index({ tokenName: 1 });
EarnSchema.index({ maxRate: -1 });
