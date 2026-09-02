import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRelationWithMoodEntryAsWellAsUniqueIndex1788327819823 implements MigrationInterface {
  name = 'AddUserRelationWithMoodEntryAsWellAsUniqueIndex1788327819823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mood_entries" ADD "userId" uuid`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_288625dd589c8e5005b50d91c3" ON "mood_entries"  ("day", "userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "mood_entries" ADD CONSTRAINT "FK_a33707e88dd7c04a5d8de807556" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mood_entries" DROP CONSTRAINT "FK_a33707e88dd7c04a5d8de807556"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_288625dd589c8e5005b50d91c3"`,
    );
    await queryRunner.query(`ALTER TABLE "mood_entries" DROP COLUMN "userId"`);
  }
}
