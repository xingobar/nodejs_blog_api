import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { Post } from "entity/post.entity";
import { Profile } from "entity/profile.entity";
import { LikeAble } from "entity/likeable.entity";

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
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    comment: "驗證 token",
    name: "confirm_token",
  })
  confirmToken: string;

  // 個人資料
  @OneToOne(() => Profile, { lazy: true })
  @JoinColumn()
  profile: Profile;

  @Column({ nullable: true })
  profileId: number;

  // 使用者的文章
  @OneToMany(() => Post, (post) => post.user)
  post: Post;

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

  // 喜歡的文章
  @OneToMany(() => LikeAble, (likeables) => likeables.user, { lazy: true })
  likes: LikeAble[];
}
