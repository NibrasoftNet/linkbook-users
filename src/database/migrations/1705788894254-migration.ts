import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705788894254 implements MigrationInterface {
    name = 'Migration1705788894254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "social_id" character varying, "first_name" character varying, "last_name" character varying, "phone" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cd76a8cdee62eeff31d384b73" ON "user" ("social_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `);
        await queryRunner.query(`CREATE TABLE "status" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" integer NOT NULL, "example_field" integer NOT NULL, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e1f623798118e629b46a9e629"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cd76a8cdee62eeff31d384b73"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
