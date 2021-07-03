import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFeedbackScoreToPost1625289415009 implements MigrationInterface {
    name = 'AddFeedbackScoreToPost1625289415009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` ADD `feedback_score` float NOT NULL COMMENT '評論分數' DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `posts` DROP COLUMN `feedback_score`");
    }

}
