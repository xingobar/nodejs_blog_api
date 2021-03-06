import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1624703941780 implements MigrationInterface {
    name = 'CreateUserTable1624703941780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `account` varchar(255) NOT NULL COMMENT '帳號', `email` varchar(255) NOT NULL COMMENT '電子信箱', `password` varchar(255) NOT NULL COMMENT '密碼', `confirm_token` varchar(255) NULL COMMENT '驗證 token', `created_at` timestamp(6) NOT NULL COMMENT '新增時間' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新時間' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deleted_at` timestamp(6) NULL COMMENT '刪除時間', UNIQUE INDEX `IDX_dd44b05034165835d6dcc18d68` (`account`), UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP INDEX `IDX_dd44b05034165835d6dcc18d68` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
