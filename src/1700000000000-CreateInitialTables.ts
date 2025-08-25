import { EarnItemLevel } from '@modules-api/earn/types';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы earn_data
    await queryRunner.createTable(
      new Table({
        name: 'earn_data',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'tokenName',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'periodType',
            type: 'enum',
            enum: ['flexible', 'fixed'],
            default: `'flexible'`,
          },
          {
            name: 'platformName',
            type: 'varchar',
          },
          {
            name: 'platformLink',
            type: 'varchar',
          },
          {
            name: 'platformRefLink',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'productLevel',
            type: 'enum',
            enum: Object.values(EarnItemLevel),
            default: `'Normal'`,
          },
          {
            name: 'maxRate',
            type: 'decimal',
            precision: 10,
            scale: 4,
          },
          {
            name: 'rateSettings',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'badges',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Создание индекса для earn_data
    await queryRunner.query(
      'CREATE INDEX IDX_EARN_PLATFORM_TOKEN_DURATION ON earn_data (platformName, tokenName, maxRate)',
    );

    // Создание таблицы pool_data
    // await queryRunner.createTable(
    //   new Table({
    //     name: 'pool_data',
    //     columns: [
    //       {
    //         name: 'id',
    //         type: 'uuid',
    //         isPrimary: true,
    //         generationStrategy: 'uuid',
    //         default: 'uuid_generate_v4()',
    //       },
    //       {
    //         name: 'platform',
    //         type: 'varchar',
    //         length: '100',
    //       },
    //       {
    //         name: 'token0',
    //         type: 'varchar',
    //         length: '20',
    //       },
    //       {
    //         name: 'token1',
    //         type: 'varchar',
    //         length: '20',
    //       },
    //       {
    //         name: 'liquidity',
    //         type: 'decimal',
    //         precision: 20,
    //         scale: 8,
    //       },
    //       {
    //         name: 'volume24h',
    //         type: 'decimal',
    //         precision: 10,
    //         scale: 4,
    //       },
    //       {
    //         name: 'fee',
    //         type: 'decimal',
    //         precision: 10,
    //         scale: 4,
    //       },
    //       {
    //         name: 'tvl',
    //         type: 'decimal',
    //         precision: 20,
    //         scale: 8,
    //         isNullable: true,
    //       },
    //       {
    //         name: 'isActive',
    //         type: 'boolean',
    //         default: true,
    //       },
    //       {
    //         name: 'additionalData',
    //         type: 'jsonb',
    //         isNullable: true,
    //       },
    //       {
    //         name: 'createdAt',
    //         type: 'timestamp',
    //         default: 'CURRENT_TIMESTAMP',
    //       },
    //       {
    //         name: 'updatedAt',
    //         type: 'timestamp',
    //         default: 'CURRENT_TIMESTAMP',
    //       },
    //     ],
    //   }),
    //   true,
    // );

    // // Создание индекса для pool_data
    // await queryRunner.query(
    //   'CREATE INDEX IDX_POOL_PLATFORM_TOKEN0_TOKEN1 ON pool_data (platform, token0, token1)',
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pool_data');
    await queryRunner.dropTable('earn_data');
  }
}
