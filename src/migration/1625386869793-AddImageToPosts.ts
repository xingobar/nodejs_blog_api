import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImageToPosts1625386869793 implements MigrationInterface {
    name = 'AddImageToPosts1625386869793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` ADD `image` varchar(255) NULL COMMENT '封面圖'");
        await queryRunner.query("ALTER TABLE `posts` ADD `status` enum ('DRAFT', 'PUBLISH') NOT NULL COMMENT '文章狀態' DEFAULT 'DRAFT'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `posts` DROP COLUMN `image`");
    }

}
