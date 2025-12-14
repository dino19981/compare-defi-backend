import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { EarnEntity, EarnDocument } from '../entities/earn.entity';
import { EarnItemDto, EarnRequest } from '../dtos/earn.dto';
import { keyBy } from 'lodash';
import { DEFAULT_SEO_POSITION } from '../constants';

@Injectable()
export class EarnRepository {
  constructor(
    @InjectModel(EarnEntity.name)
    private readonly earnModel: Model<EarnDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async findBy(
    query: EarnRequest,
  ): Promise<{ data: EarnItemDto[]; total: number }> {
    const filter = this.buildMongoFilter(query.filter);
    const sort = this.buildMongoSort(query.sort);

    const [data, total] = await Promise.all([
      this.earnModel.find(filter).sort(sort).limit(query.limit).lean().exec(),
      this.earnModel.countDocuments(filter),
    ]);

    return {
      data: data.map((item) => this.formatToEarnItem(item)),
      total,
    };
  }

  async findAll(): Promise<EarnItemDto[]> {
    const data = await this.earnModel.find().exec();

    return data;
  }

  async replaceMany(data: EarnItemDto[]): Promise<EarnItemDto[]> {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.earnModel.deleteMany({}, { session });
        await this.earnModel.insertMany(data, { session });
      });

      return data;
    } finally {
      await session.endSession();
    }
  }

  async saveMany(data: EarnItemDto[]): Promise<EarnItemDto[]> {
    await this.earnModel.insertMany(data);
    return data;
  }

  /**
   * 1) Если не пришло обновление для какого-то earn item, то удаляем его из базы
   * 2) Если какого то earn item нет в базе а он пришел в обновлении, то добавляем его в базу
   */
  async smartUpdate(data: EarnItemDto[]): Promise<EarnItemDto[]> {
    const currentEarns = this.earnModel.find({});
    const dataById = keyBy(data, 'id');

    const BATCH_SIZE = 1000;
    const updates: any[] = [];
    const deletes: string[] = [];

    const currentEarnsCount = await currentEarns.countDocuments();

    // Если база пустая, то просто сохраняем все данные
    if (currentEarnsCount === 0) {
      console.log(`Сохранение earn в пустую базу, кол-во - ${data.length} шт.`);
      return this.saveMany(data);
    }

    for await (const doc of currentEarns) {
      const newData = dataById[doc.id];

      if (!newData) {
        console.log(doc, 'удаляется');

        if (
          Object.keys(doc.positions).length > 0 &&
          doc.positions?.seo !== DEFAULT_SEO_POSITION
        ) {
          console.log('Удален earn item с позициями!!!!', doc.positions);
        }

        deletes.push(doc.id);
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { positions, ...restNewData } = newData;

      updates.push({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: restNewData,
          },
        },
      });

      delete dataById[doc.id];

      if (updates.length === BATCH_SIZE) {
        console.log(`Обновлены ${updates.length} earn items`);

        await this.earnModel.bulkWrite(updates, { ordered: false });
        updates.length = 0;
      }
    }

    if (updates.length > 0) {
      console.log(`Обновлены ${updates.length} earn items после цикла`);

      await this.earnModel.bulkWrite(updates, { ordered: false });
    }

    if (Object.keys(dataById).length > 0) {
      console.log(
        `Добавлены новые earn items ${Object.keys(dataById).length}}`,
      );

      await this.earnModel.insertMany(Object.values(dataById));
    }

    if (deletes.length > 0) {
      console.log(`Удалены earn items ${deletes.length}`);

      await this.earnModel.deleteMany({ id: { $in: deletes } });
    }

    return data;
  }

  async updatePositions() {
    const currentEarns = this.earnModel.find({});

    const BATCH_SIZE = 1000;
    const updates: any[] = [];

    for await (const doc of currentEarns) {
      if (!doc.positions.seo) {
        updates.push({
          updateOne: {
            filter: { _id: doc._id },
            update: {
              $set: {
                positions: {
                  seo: 99999,
                },
              },
            },
          },
        });
      }

      if (updates.length === BATCH_SIZE) {
        await this.earnModel.bulkWrite(updates, { ordered: false });
        updates.length = 0;
      }
    }

    if (updates.length > 0) {
      await this.earnModel.bulkWrite(updates, { ordered: false });
    }
  }

  private buildMongoFilter(filters: Record<string, any> | undefined): any {
    if (!filters) return {};

    const mongoFilter: any = {};

    if (filters.tokenName && filters.tokenName.length > 0) {
      mongoFilter['token.name'] = { $in: filters.tokenName };
    }

    if (filters.platformName && filters.platformName.length > 0) {
      mongoFilter['platform.name'] = { $in: filters.platformName };
    }

    return mongoFilter;
  }

  private buildMongoSort(
    sort: { field: string; direction: string } | undefined,
  ): any {
    if (!sort) return {};

    const direction = sort.direction.toUpperCase() === 'ASC' ? 1 : -1;
    return { [sort.field]: direction };
  }

  private formatToEarnItem(item: EarnDocument): EarnItemDto {
    return {
      id: item.id,
      name: item.name,
      periodType: item.periodType,
      token: {
        name: item.token.name,
        icon: item.token.icon,
      },
      platform: {
        name: item.platform.name,
        link: item.platform.link,
        refLink: item.platform.refLink,
      },
      productLevel: item.productLevel,

      maxRate: item.maxRate,
      ...(item?.rateSettings && {
        rateSettings: item.rateSettings.map((setting) => ({
          min: setting.min,
          max: setting.max,
          apy: setting.apy,
        })),
      }),
      duration: item.duration,
      ...(item.badges && {
        badges: [...item.badges],
      }),
      positions: item.positions,
    };
  }
}
