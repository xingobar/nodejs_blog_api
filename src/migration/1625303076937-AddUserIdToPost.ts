import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserIdToPost1625303076937 implements MigrationInterface {
    name = 'AddUserIdToPost1625303076937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` ADD `userId` int NULL");
        await queryRunner.query("ALTER TABLE `posts` ADD CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP FOREIGN KEY `FK_ae05faaa55c866130abef6e1fee`");
        await queryRunner.query("ALTER TABLE `posts` DROP COLUMN `userId`");
    }

}
