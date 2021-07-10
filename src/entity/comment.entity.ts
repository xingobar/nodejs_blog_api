import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { User } from "entity/user.entity";
import { Post } from "entity/post.entity";

@Entity("comments")
@Tree("closure-table")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, { lazy: true })
  user: User;

  @Column({
    comment: "會員編號",
  })
  userId: number;

  @ManyToOne(() => Post, (post) => post.comments, { lazy: true })
  post: Post;

  @Column({
    comment: "文章編號",
  })
  postId: number;

  @Column({
    name: "body",
    comment: "評論內容",
  })
  body: string;

  @TreeChildren()
  children: Comment[];

  @TreeParent()
  parent: Comment;

  @Column({
    nullable: true,
    comment: "父向編號",
  })
  parentId: number;

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
