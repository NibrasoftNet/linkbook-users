import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705789096123 implements MigrationInterface {
    name = 'Migration1705789096123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "social_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "social_id" character varying`);
    }

}
