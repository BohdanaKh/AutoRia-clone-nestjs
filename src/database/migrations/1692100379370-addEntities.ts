import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEntities1692100379370 implements MigrationInterface {
  name = 'AddEntities1692100379370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "email" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "age" integer, "password" character varying, "role" "public"."user_role_enum", "account" "public"."user_account_enum" NOT NULL DEFAULT 'Base', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "advert" ("id" SERIAL NOT NULL, "year" text DEFAULT '0000', "priceUAH" integer DEFAULT '1', "priceUSD" text NOT NULL, "priceEUR" text NOT NULL, "userSpecifiedPrice" double precision NOT NULL, "categories" character varying DEFAULT '', "brand" character varying DEFAULT '', "model" character varying DEFAULT '', "modification" character varying DEFAULT '', "body" character varying DEFAULT '', "mileage" integer DEFAULT '1', "region" character varying DEFAULT '', "city" character varying DEFAULT '', "photo" character varying NOT NULL, "views" TIMESTAMP array NOT NULL DEFAULT '{}', "isPublished" boolean NOT NULL DEFAULT true, "userId" integer, CONSTRAINT "UQ_2097651e1f150d45137a4e83723" UNIQUE ("id", "brand", "model"), CONSTRAINT "PK_4bd8b4cdfb562b02706beece450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert" ADD CONSTRAINT "FK_2a3714047a0c902fd9d5077fdcb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "advert" DROP CONSTRAINT "FK_2a3714047a0c902fd9d5077fdcb"`,
    );
    await queryRunner.query(`DROP TABLE "advert"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
