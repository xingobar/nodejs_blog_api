import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePostTable1625289099297 implements MigrationInterface {
    name = 'CreatePostTable1625289099297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_b1bda35cdb9a2c1b777f5541d8` ON `users`");
        await queryRunner.query("CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL COMMENT '標題', `body` text NOT NULL COMMENT '內容', `like_count` int NOT NULL COMMENT '喜歡的個數' DEFAULT '0', `bookmark_count` int NOT NULL COMMENT '收藏的個數' DEFAULT '0', `view_count` int NOT NULL COMMENT '觀看次數' DEFAULT '0', `created_at` datetime(6) NOT NULL COMMENT '新增時間' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL COMMENT '更新時間' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, UNIQUE INDEX `REL_ae05faaa55c866130abef6e1fe` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `posts` ADD CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP FOREIGN KEY `FK_ae05faaa55c866130abef6e1fee`");
        await queryRunner.query("DROP INDEX `REL_ae05faaa55c866130abef6e1fe` ON `posts`");
        await queryRunner.query("DROP TABLE `posts`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_b1bda35cdb9a2c1b777f5541d8` ON `users` (`profileId`)");
    }

}
