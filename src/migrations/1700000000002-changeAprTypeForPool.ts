import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAprTypeForPool1700000000002 implements MigrationInterface {
  name = 'ChangeAprTypeForPool1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Принудительно приводим тип колонки apr к decimal с явным приведением
    await queryRunner.query(
      `ALTER TABLE "pools_data" ALTER COLUMN "apr" TYPE DECIMAL(10,4) USING "apr"::DECIMAL(10,4)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Возвращаем тип колонки apr обратно к varchar
    await queryRunner.query(
      `ALTER TABLE "pools_data" ALTER COLUMN "apr" TYPE VARCHAR`,
    );
  }
}
