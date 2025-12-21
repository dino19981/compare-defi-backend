import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenEntity, TokenDocument } from './token.entity';
import { TokenModel } from './types/TokensDto';
import { formatToLowerCaseTokenName } from './helpers';
import { hardcodedTokens } from './constants';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectModel(TokenEntity.name)
    private readonly tokensModel: Model<TokenDocument>,
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
    try {
      await this.tokensModel.deleteMany({});
      await this.tokensModel.insertMany(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
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
    const result = data.reduce(
      (acc, item) => {
        acc[formatToLowerCaseTokenName(item.symbol)] =
          this.formatToTokenModel(item);

        return acc;
      },
      {} as Record<string, TokenModel>,
    );

    hardcodedTokens.forEach((token) => {
      result[formatToLowerCaseTokenName(token.symbol)] = token;
    });

    return result;
  }
}
