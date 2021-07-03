import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { User } from "entity/user.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn()
  user: User;

  @Column({
    name: "title",
    comment: "標題",
  })
  title: string;

  @Column({
    type: "text",
    name: "body",
    comment: "內容",
  })
  body: string;

  @Column({
    name: "feedback_score",
    type: "float",
    default: 0,
    comment: "評論分數",
  })
  feedbackScore: number;

  @Column({
    name: "like_count",
    comment: "喜歡的個數",
    default: 0,
  })
  likeCount: number;

  @Column({
    name: "bookmark_count",
    comment: "收藏的個數",
    default: 0,
  })
  bookmarkCount: number;

  @Column({
    name: "view_count",
    comment: "觀看次數",
    default: 0,
  })
  viewCount: number;

  @CreateDateColumn({
    name: "created_at",
    comment: "新增時間",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    comment: "更新時間",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    comment: "刪除時間",
  })
  deletedAt: Date;
}