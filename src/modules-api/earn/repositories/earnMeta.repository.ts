import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { EarnMetaEntity, EarnMetaDocument } from '../entities';
import { EarnMetaDto } from '../dtos/EarnMeta.dto';

@Injectable()
export class EarnMetaRepository {
  constructor(
    @InjectModel(EarnMetaEntity.name)
    private readonly earnMetaModel: Model<EarnMetaDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async find(): Promise<EarnMetaDto> {
    const data = await this.earnMetaModel.find().exec();

    return data[0];
  }

  async replace(data: EarnMetaDto): Promise<EarnMetaDto> {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.earnMetaModel.deleteMany({}, { session });
        await this.earnMetaModel.create([data], { session });
      });

      return data;
    } finally {
      await session.endSession();
    }
  }
}
