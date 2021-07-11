import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTagTable1626014498739 implements MigrationInterface {
    name = 'CreateTagTable1626014498739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `tags` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL COMMENT '標籤名稱', PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `taggables` (`id` int NOT NULL AUTO_INCREMENT, `postId` int NOT NULL COMMENT '文章編號', `entityId` int NOT NULL, `entityType` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `taggables` ADD CONSTRAINT `FK_d75e13a8d6c70110a7614c82cb5` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `taggables` DROP FOREIGN KEY `FK_d75e13a8d6c70110a7614c82cb5`");
        await queryRunner.query("DROP TABLE `taggables`");
        await queryRunner.query("DROP TABLE `tags`");
    }

}
