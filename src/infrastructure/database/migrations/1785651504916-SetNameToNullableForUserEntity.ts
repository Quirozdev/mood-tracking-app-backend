import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetNameToNullableForUserEntity1785651504916 implements MigrationInterface {
  name = 'SetNameToNullableForUserEntity1785651504916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
