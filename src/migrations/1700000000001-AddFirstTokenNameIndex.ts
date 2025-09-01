import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstTokenNameIndex1700000000001 implements MigrationInterface {
  name = 'AddFirstTokenNameIndex1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_FIRST_TOKEN_NAME" ON "pools_data" (("firstToken"->>'name'))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SECOND_TOKEN_NAME" ON "pools_data" (("secondToken"->>'name'))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CHAIN_NAME" ON "pools_data" (("chain"->>'name'))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PLATFORM_NAME" ON "pools_data" (("platform"->>'name'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_FIRST_TOKEN_NAME"`);
    await queryRunner.query(`DROP INDEX "IDX_SECOND_TOKEN_NAME"`);
    await queryRunner.query(`DROP INDEX "IDX_CHAIN_NAME"`);
    await queryRunner.query(`DROP INDEX "IDX_PLATFORM_NAME"`);
  }
}
