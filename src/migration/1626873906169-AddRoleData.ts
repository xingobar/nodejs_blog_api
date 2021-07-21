import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleData1626873906169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('admin'), ('users')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE "name" IN ('admin', 'users')`);
  }
}
