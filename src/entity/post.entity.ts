import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "entity/user.entity";
import { PolymorphicChildren } from "typeorm-polymorphic";
import { Likeable } from "entity/likeable.entity";
import { Comment } from "entity/comment.entity";
import { Taggable } from "entity/taggable.entity";

export enum PostStatus {
  DRAFT = "DRAFT",
  OFFLINE = "OFFLINE",
  PUBLISH = "PUBLISH",
}

/**
 * 章節排序 key type
 */
export const postSortKeyType = {
  CREATED_AT: "created_at",
  ID: "id",
  TITLE: "title",
  UPDATED_AT: "updated_at",
};

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "userId",
    comment: "會員編號",
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.post, { lazy: true })
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
    comment: "封面圖",
    name: "image",
    nullable: true,
  })
  image: string;

  @Column({
    type: "enum",
    enum: PostStatus,
    name: "status",
    comment: "文章狀態",
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

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

  @PolymorphicChildren(() => Likeable, {
    eager: false,
  })
  likes: Likeable[];

  @OneToMany(() => Comment, (comments) => comments.post)
  comments: Comment[];

  @OneToMany(() => Taggable, (taggable) => taggable.post, {
    eager: false,
  })
  tags: Taggable[];
}
