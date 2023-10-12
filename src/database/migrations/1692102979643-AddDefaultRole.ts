import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultRole1692102979643 implements MigrationInterface {
    name = 'AddDefaultRole1692102979643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'Seller'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
    }

}
