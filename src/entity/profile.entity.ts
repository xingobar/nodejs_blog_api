import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "電話",
    nullable: true,
  })
  phone: string;

  @Column({
    comment: "性別",
    nullable: true,
  })
  gender: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "新增時間",
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新時間",
    name: "updated_at",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamp",
    comment: "刪除時間",
    name: "deleted_at",
  })
  deletedAt: Date;
}
