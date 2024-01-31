import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705789045899 implements MigrationInterface {
    name = 'Migration1705789045899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0cd76a8cdee62eeff31d384b73"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_0cd76a8cdee62eeff31d384b73" ON "user" ("social_id") `);
    }

}
