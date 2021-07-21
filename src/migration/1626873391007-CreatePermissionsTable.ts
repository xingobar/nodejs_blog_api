import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePermissionsTable1626873391007 implements MigrationInterface {
    name = 'CreatePermissionsTable1626873391007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `permissions` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL COMMENT '權限名稱', `action` varchar(255) NOT NULL COMMENT '權限操作', `created_at` datetime(6) NOT NULL COMMENT '新增時間' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL COMMENT '更新時間' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deleted_at` datetime(6) NULL COMMENT '刪除時間', PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `permissions`");
    }

}
