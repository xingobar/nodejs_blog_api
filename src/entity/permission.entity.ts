import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

// 標籤權限
export enum TagPermissionAction {
  TAG_CREATED = "tag.created", // 新增標籤
  TAG_UPDATED = "tag.updated", // 更新標籤
  TAG_DELETED = "tag.deleted", // 刪除標籤
  TAG_INDEX = "tag.index", // 標籤列表
  TAG_SHOW = "tag.show", // 顯示標籤
}

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "name",
    comment: "權限名稱",
  })
  name: string;

  @Column({
    name: "action",
    comment: "權限操作",
  })
  action: string;

  @CreateDateColumn({
    name: "created_at",
    comment: "新增時間",
  })
  createdAt: string;

  @UpdateDateColumn({
    name: "updated_at",
    comment: "更新時間",
  })
  updatedAt: string;

  @DeleteDateColumn({
    name: "deleted_at",
    comment: "刪除時間",
  })
  deletedAt: string;
}
