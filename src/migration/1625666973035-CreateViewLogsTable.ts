import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateViewLogsTable1625666973035 implements MigrationInterface {
    name = 'CreateViewLogsTable1625666973035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `view_logs` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NULL COMMENT '會員編號', `entityId` int NOT NULL, `entityType` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL COMMENT '觀看的時間' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `view_logs` ADD CONSTRAINT `FK_486a06f56a310fe2f2438e4b0e8` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `view_logs` DROP FOREIGN KEY `FK_486a06f56a310fe2f2438e4b0e8`");
        await queryRunner.query("DROP TABLE `view_logs`");
    }

}
