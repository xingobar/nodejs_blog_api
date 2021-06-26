import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users") // 資料表名稱 users
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "帳號",
    unique: true,
  })
  account: string;

  @Column({
    comment: "電子信箱",
    unique: true,
  })
  email: string;

  @Column({
    comment: "密碼",
  })
  password: string;

  @Column({
    nullable: true,
    comment: "驗證 token",
    name: "confirm_token",
  })
  confirmToken: string;

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
}
