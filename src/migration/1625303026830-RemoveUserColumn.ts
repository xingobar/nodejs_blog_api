import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveUserColumn1625303026830 implements MigrationInterface {
    name = 'RemoveUserColumn1625303026830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP FOREIGN KEY `FK_ae05faaa55c866130abef6e1fee`");
        await queryRunner.query("DROP INDEX `REL_ae05faaa55c866130abef6e1fe` ON `posts`");
        await queryRunner.query("ALTER TABLE `posts` DROP COLUMN `userId`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` ADD `userId` int NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_ae05faaa55c866130abef6e1fe` ON `posts` (`userId`)");
        await queryRunner.query("ALTER TABLE `posts` ADD CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
