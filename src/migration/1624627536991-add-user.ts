import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1624627536991 implements MigrationInterface {
  name = "addUser1624627536991";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `account` varchar(255) NOT NULL COMMENT '帳號', `email` varchar(255) NOT NULL COMMENT '電子信箱', `password` varchar(255) NOT NULL COMMENT '密碼', `name` varchar(255) NULL COMMENT '名稱', `confirm_token` varchar(255) NULL COMMENT '驗證 token', `created_at` timestamp(6) NOT NULL COMMENT '新增時間' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新時間' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `users`");
  }
}
