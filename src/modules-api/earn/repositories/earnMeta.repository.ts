import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EarnMetaEntity, EarnMetaDocument } from '../entities';
import { EarnMetaDto } from '../dtos/EarnMeta.dto';
import { omit } from 'lodash';

@Injectable()
export class EarnMetaRepository {
  constructor(
    @InjectModel(EarnMetaEntity.name)
    private readonly earnMetaModel: Model<EarnMetaDocument>,
  ) {}

  async find(): Promise<EarnMetaDto> {
    const data = await this.earnMetaModel.find().lean().exec();

    return omit(data[0], '__v', '_id');
  }

  async replace(data: EarnMetaDto): Promise<EarnMetaDto> {
    await this.earnMetaModel.deleteMany({});
    await this.earnMetaModel.create([data]);

    return data;
  }
}
