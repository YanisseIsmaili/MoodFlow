import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1760693057864 implements MigrationInterface {
    name = 'Init1760693057864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("uuid" varchar PRIMARY KEY NOT NULL, "firstName" varchar(50), "lastName" varchar(50), "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "moods" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL, "description" text, "state" varchar CHECK( "state" IN ('BAD','MEH','OK','GOOD','GREAT') ) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userUuid" varchar, CONSTRAINT "UQ_1c22abbd3b560c4f10b3ec1aaf2" UNIQUE ("userUuid", "date"))`);
        await queryRunner.query(`CREATE TABLE "mood_activities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "label" varchar CHECK( "label" IN ('WORK','STUDY','EXERCISE','FRIENDS','FAMILY','GAMING','TVSHOWS','MUSIC','COOKING','MEDITATION','REST','CREATIVITY') ) NOT NULL, "moodId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_moods" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL, "description" text, "state" varchar CHECK( "state" IN ('BAD','MEH','OK','GOOD','GREAT') ) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userUuid" varchar, CONSTRAINT "UQ_1c22abbd3b560c4f10b3ec1aaf2" UNIQUE ("userUuid", "date"), CONSTRAINT "FK_766a699ec443de2b6c17f032dc2" FOREIGN KEY ("userUuid") REFERENCES "users" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_moods"("id", "date", "description", "state", "created_at", "userUuid") SELECT "id", "date", "description", "state", "created_at", "userUuid" FROM "moods"`);
        await queryRunner.query(`DROP TABLE "moods"`);
        await queryRunner.query(`ALTER TABLE "temporary_moods" RENAME TO "moods"`);
        await queryRunner.query(`CREATE TABLE "temporary_mood_activities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "label" varchar CHECK( "label" IN ('WORK','STUDY','EXERCISE','FRIENDS','FAMILY','GAMING','TVSHOWS','MUSIC','COOKING','MEDITATION','REST','CREATIVITY') ) NOT NULL, "moodId" integer, CONSTRAINT "FK_d977c4a9461642a60ddfd49fc6d" FOREIGN KEY ("moodId") REFERENCES "moods" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_mood_activities"("id", "label", "moodId") SELECT "id", "label", "moodId" FROM "mood_activities"`);
        await queryRunner.query(`DROP TABLE "mood_activities"`);
        await queryRunner.query(`ALTER TABLE "temporary_mood_activities" RENAME TO "mood_activities"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood_activities" RENAME TO "temporary_mood_activities"`);
        await queryRunner.query(`CREATE TABLE "mood_activities" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "label" varchar CHECK( "label" IN ('WORK','STUDY','EXERCISE','FRIENDS','FAMILY','GAMING','TVSHOWS','MUSIC','COOKING','MEDITATION','REST','CREATIVITY') ) NOT NULL, "moodId" integer)`);
        await queryRunner.query(`INSERT INTO "mood_activities"("id", "label", "moodId") SELECT "id", "label", "moodId" FROM "temporary_mood_activities"`);
        await queryRunner.query(`DROP TABLE "temporary_mood_activities"`);
        await queryRunner.query(`ALTER TABLE "moods" RENAME TO "temporary_moods"`);
        await queryRunner.query(`CREATE TABLE "moods" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL, "description" text, "state" varchar CHECK( "state" IN ('BAD','MEH','OK','GOOD','GREAT') ) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userUuid" varchar, CONSTRAINT "UQ_1c22abbd3b560c4f10b3ec1aaf2" UNIQUE ("userUuid", "date"))`);
        await queryRunner.query(`INSERT INTO "moods"("id", "date", "description", "state", "created_at", "userUuid") SELECT "id", "date", "description", "state", "created_at", "userUuid" FROM "temporary_moods"`);
        await queryRunner.query(`DROP TABLE "temporary_moods"`);
        await queryRunner.query(`DROP TABLE "mood_activities"`);
        await queryRunner.query(`DROP TABLE "moods"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
