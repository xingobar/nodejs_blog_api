import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCommentsTable1625898649603 implements MigrationInterface {
    name = 'CreateCommentsTable1625898649603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `comments` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL COMMENT '會員編號', `postId` int NOT NULL COMMENT '文章編號', `body` varchar(255) NOT NULL COMMENT '評論內容', `created_at` datetime(6) NOT NULL COMMENT '新增時間' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL COMMENT '更新時間' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL COMMENT '刪除時間', `parentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `comments_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_89a2762362d968c2939b6fab19` (`id_ancestor`), INDEX `IDX_d2164211fd6ab117cfb2ab8ba9` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `posts` DROP FOREIGN KEY `FK_ae05faaa55c866130abef6e1fee`");
        await queryRunner.query("ALTER TABLE `posts` CHANGE `userId` `userId` int NOT NULL COMMENT '會員編號'");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_7e8d7c49f218ebb14314fdb3749` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_e44ddaaa6d058cb4092f83ad61f` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments` ADD CONSTRAINT `FK_8770bd9030a3d13c5f79a7d2e81` FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `posts` ADD CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments_closure` ADD CONSTRAINT `FK_89a2762362d968c2939b6fab193` FOREIGN KEY (`id_ancestor`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comments_closure` ADD CONSTRAINT `FK_d2164211fd6ab117cfb2ab8ba96` FOREIGN KEY (`id_descendant`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comments_closure` DROP FOREIGN KEY `FK_d2164211fd6ab117cfb2ab8ba96`");
        await queryRunner.query("ALTER TABLE `comments_closure` DROP FOREIGN KEY `FK_89a2762362d968c2939b6fab193`");
        await queryRunner.query("ALTER TABLE `posts` DROP FOREIGN KEY `FK_ae05faaa55c866130abef6e1fee`");
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_8770bd9030a3d13c5f79a7d2e81`");
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_e44ddaaa6d058cb4092f83ad61f`");
        await queryRunner.query("ALTER TABLE `comments` DROP FOREIGN KEY `FK_7e8d7c49f218ebb14314fdb3749`");
        await queryRunner.query("ALTER TABLE `posts` CHANGE `userId` `userId` int NULL");
        await queryRunner.query("ALTER TABLE `posts` ADD CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("DROP INDEX `IDX_d2164211fd6ab117cfb2ab8ba9` ON `comments_closure`");
        await queryRunner.query("DROP INDEX `IDX_89a2762362d968c2939b6fab19` ON `comments_closure`");
        await queryRunner.query("DROP TABLE `comments_closure`");
        await queryRunner.query("DROP TABLE `comments`");
    }

}
