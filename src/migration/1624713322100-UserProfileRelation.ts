import {MigrationInterface, QueryRunner} from "typeorm";

export class UserProfileRelation1624713322100 implements MigrationInterface {
    name = 'UserProfileRelation1624713322100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `profileId` int NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_b1bda35cdb9a2c1b777f5541d8` (`profileId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_b1bda35cdb9a2c1b777f5541d8` ON `users` (`profileId`)");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_b1bda35cdb9a2c1b777f5541d87` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_b1bda35cdb9a2c1b777f5541d87`");
        await queryRunner.query("DROP INDEX `REL_b1bda35cdb9a2c1b777f5541d8` ON `users`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_b1bda35cdb9a2c1b777f5541d8`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `profileId`");
    }

}
