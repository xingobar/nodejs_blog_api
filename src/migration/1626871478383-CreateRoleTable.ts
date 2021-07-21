import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateRoleTable1626871478383 implements MigrationInterface {
    name = 'CreateRoleTable1626871478383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `roles` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL COMMENT '角色名稱', PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `roles`");
    }

}
