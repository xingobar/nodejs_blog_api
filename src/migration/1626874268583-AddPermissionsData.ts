import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionsData1626874268583 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO permissions 
                      (name, action)
                    VALUES
                      ("新增標籤", "tag.created"),
                      ("更新標籤", "tag.updated"),
                      ("刪除標籤", "tag.deleted"),
                      ("顯示標籤列表", "tags.index"),
                      ("顯示標籤", "tags.show")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM permissions
        WHERE action LIKE 'tag.%'
    `);
  }
}
