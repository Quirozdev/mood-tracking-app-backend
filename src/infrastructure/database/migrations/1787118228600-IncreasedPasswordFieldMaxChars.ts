import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncreasedPasswordFieldMaxChars1787118228600 implements MigrationInterface {
  name = 'IncreasedPasswordFieldMaxChars1787118228600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying(55) NOT NULL`,
    );
  }
}
