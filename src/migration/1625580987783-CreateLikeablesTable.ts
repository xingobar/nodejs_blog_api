import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateLikeablesTable1625580987783 implements MigrationInterface {
    name = 'CreateLikeablesTable1625580987783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `likeables` (`id` int NOT NULL AUTO_INCREMENT, `entityId` int NOT NULL, `entityType` varchar(255) NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `likeables` ADD CONSTRAINT `FK_77f0a53750fc91c0ab5e71e8a4b` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `likeables` DROP FOREIGN KEY `FK_77f0a53750fc91c0ab5e71e8a4b`");
        await queryRunner.query("DROP TABLE `likeables`");
    }

}
