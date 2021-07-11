import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAvatarToUser1626010889943 implements MigrationInterface {
    name = 'AddAvatarToUser1626010889943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `avatar` varchar(255) NULL COMMENT '使用者頭像'");
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_8770bd9030a3d13c5f79a7d2e81`");
        await queryRunner.query("ALTER TABLE `comments` CHANGE `parentId` `parentId` int NULL COMMENT '父向編號'");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_8770bd9030a3d13c5f79a7d2e81` FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_8770bd9030a3d13c5f79a7d2e81`");
        await queryRunner.query("ALTER TABLE `comments` CHANGE `parentId` `parentId` int NULL");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_8770bd9030a3d13c5f79a7d2e81` FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `avatar`");
    }

}
