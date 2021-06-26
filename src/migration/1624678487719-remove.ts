import {MigrationInterface, QueryRunner} from "typeorm";

export class remove1624678487719 implements MigrationInterface {
    name = 'remove1624678487719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `test`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `test` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` ADD `name` varchar(255) NULL COMMENT '名稱'");
    }

}
