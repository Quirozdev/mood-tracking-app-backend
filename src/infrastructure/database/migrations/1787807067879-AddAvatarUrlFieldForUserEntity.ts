import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarUrlFieldForUserEntity1787807067879 implements MigrationInterface {
  name = 'AddAvatarUrlFieldForUserEntity1787807067879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatarUrl" character varying(510)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
  }
}
