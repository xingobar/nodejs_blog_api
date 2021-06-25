import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUniqueColumn1624637983447 implements MigrationInterface {
  name = "userUniqueColumn1624637983447";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_dd44b05034165835d6dcc18d68` (`account`)");
    await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`)");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_97672ac88f789774dd47f7c8be`");
    await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_dd44b05034165835d6dcc18d68`");
  }
}
