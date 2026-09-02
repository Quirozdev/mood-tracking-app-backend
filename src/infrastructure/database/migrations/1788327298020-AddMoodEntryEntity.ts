import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoodEntryEntity1788327298020 implements MigrationInterface {
  name = 'AddMoodEntryEntity1788327298020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mood_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" date NOT NULL, "mood" character varying(55) NOT NULL, "feelings" text NOT NULL, "journalEntry" character varying(150) NOT NULL, "sleepHours" character varying(55) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_535e463ec1fc30ee283f69f849c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mood_entries"`);
  }
}
