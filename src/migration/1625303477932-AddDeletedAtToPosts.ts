import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDeletedAtToPosts1625303477932 implements MigrationInterface {
    name = 'AddDeletedAtToPosts1625303477932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` ADD `deleted_at` datetime(6) NULL COMMENT '刪除時間'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP COLUMN `deleted_at`");
    }

}
