import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705949015519 implements MigrationInterface {
    name = 'Migration1705949015519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otp" ("id" SERIAL NOT NULL, "otp" character varying NOT NULL, "expiryDate" bigint NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otp"`);
    }

}
