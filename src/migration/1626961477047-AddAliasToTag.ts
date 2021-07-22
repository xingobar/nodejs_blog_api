import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAliasToTag1626961477047 implements MigrationInterface {
    name = 'AddAliasToTag1626961477047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tags` ADD `alias` varchar(255) NOT NULL COMMENT '別名'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tags` DROP COLUMN `alias`");
    }

}
