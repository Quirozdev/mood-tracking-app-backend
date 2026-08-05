import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePrimaryGeneratedColumnConstrainForUser1785652002642 implements MigrationInterface {
  name = 'ChangePrimaryGeneratedColumnConstrainForUser1785652002642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
  }
}
