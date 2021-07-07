import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBookmarkTable1625663861741 implements MigrationInterface {
    name = 'CreateBookmarkTable1625663861741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `bookmarks` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NULL, `entityId` int NOT NULL, `entityType` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_c6065536f2f6de3a0163e19a584` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bookmarks` DROP FOREIGN KEY `FK_c6065536f2f6de3a0163e19a584`");
        await queryRunner.query("DROP TABLE `bookmarks`");
    }

}
