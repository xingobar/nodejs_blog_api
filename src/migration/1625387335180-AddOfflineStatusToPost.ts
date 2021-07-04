import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOfflineStatusToPost1625387335180 implements MigrationInterface {
    name = 'AddOfflineStatusToPost1625387335180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` CHANGE `status` `status` enum ('DRAFT', 'OFFLINE', 'PUBLISH') NOT NULL COMMENT '文章狀態' DEFAULT 'DRAFT'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` CHANGE `status` `status` enum ('DRAFT', 'PUBLISH') NOT NULL COMMENT '文章狀態' DEFAULT 'DRAFT'");
    }

}
