import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProfileTable1624712959336 implements MigrationInterface {
    name = 'CreateProfileTable1624712959336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `profiles` (`id` int NOT NULL AUTO_INCREMENT, `phone` varchar(255) NULL COMMENT '電話', `gender` varchar(255) NULL COMMENT '性別', `created_at` timestamp(6) NOT NULL COMMENT '新增時間' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL COMMENT '更新時間' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deleted_at` timestamp(6) NULL COMMENT '刪除時間', PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `profiles`");
    }

}
