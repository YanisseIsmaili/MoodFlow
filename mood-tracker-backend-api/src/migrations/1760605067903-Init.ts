import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1760605067903 implements MigrationInterface {
    name = 'Init1760605067903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar(50) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "moods" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL, "description" text, "state" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "UQ_b7c225d0a02d5a29aae1a2d3eb3" UNIQUE ("userId", "date"))`);
        await queryRunner.query(`CREATE TABLE "temporary_moods" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL, "description" text, "state" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "UQ_b7c225d0a02d5a29aae1a2d3eb3" UNIQUE ("userId", "date"), CONSTRAINT "FK_c343c3a686ecf1ac963cc1455ca" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_moods"("id", "date", "description", "state", "created_at", "userId") SELECT "id", "date", "description", "state", "created_at", "userId" FROM "moods"`);
        await queryRunner.query(`DROP TABLE "moods"`);
        await queryRunner.query(`ALTER TABLE "temporary_moods" RENAME TO "moods"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "moods" RENAME TO "temporary_moods"`);
        await queryRunner.query(`CREATE TABLE "moods" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL, "description" text, "state" varchar(50) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "UQ_b7c225d0a02d5a29aae1a2d3eb3" UNIQUE ("userId", "date"))`);
        await queryRunner.query(`INSERT INTO "moods"("id", "date", "description", "state", "created_at", "userId") SELECT "id", "date", "description", "state", "created_at", "userId" FROM "temporary_moods"`);
        await queryRunner.query(`DROP TABLE "temporary_moods"`);
        await queryRunner.query(`DROP TABLE "moods"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
