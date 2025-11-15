import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { TokenEntity, TokenDocument } from './token.entity';
import { TokenModel } from './types/TokensDto';
import { formatToLowerCaseTokenName } from './helpers';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectModel(TokenEntity.name)
    private readonly tokensModel: Model<TokenDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async findAll() {
    const data = await this.tokensModel.find().lean().exec();
    return this.formatBySymbol(data);
  }

  async findBy(symbols: string[]) {
    const data = await this.tokensModel
      .find({ symbol: { $in: symbols } })
      .lean()
      .exec();

    return this.formatBySymbol(data);
  }

  async saveMany(data: Omit<TokenModel, 'id'>[]) {
    const res = await this.tokensModel.insertMany(data);
    return this.formatBySymbol(res);
  }

  async replaceMany(data: TokenModel[]): Promise<TokenModel[]> {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.tokensModel.deleteMany({}, { session });
        await this.tokensModel.insertMany(data, { session });
      });

      return data;
    } finally {
      await session.endSession();
    }
  }

  private formatToTokenModel(item: TokenDocument): TokenModel {
    return {
      id: item._id.toString(),
      symbol: item.symbol,
      name: item.name,
      image: item.image,
    };
  }

  private formatBySymbol(data: TokenDocument[]): Record<string, TokenModel> {
    return data.reduce(
      (acc, item) => {
        acc[formatToLowerCaseTokenName(item.symbol)] =
          this.formatToTokenModel(item);

        return acc;
      },
      {} as Record<string, TokenModel>,
    );
  }
}
