import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PoolsMetaEntity, PoolsMetaDocument } from '../entities';
import { PoolMetaDto } from '../dtos/poolMeta.dto';
import { omit } from 'lodash';

@Injectable()
export class PoolsMetaRepository {
  constructor(
    @InjectModel(PoolsMetaEntity.name)
    private readonly poolsMetaModel: Model<PoolsMetaDocument>,
  ) {}

  async find(): Promise<PoolMetaDto> {
    const data = await this.poolsMetaModel.find().lean().exec();

    return omit(data[0], '__v', '_id');
  }

  async replace(data: PoolMetaDto): Promise<PoolMetaDto> {
    await this.poolsMetaModel.deleteMany({});
    await this.poolsMetaModel.create([data]);

    return data;
  }
}
