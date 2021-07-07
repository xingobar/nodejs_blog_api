import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { PolymorphicChildInterface } from "interface/polymorphic.child.interface";
import { User } from "entity/user.entity";
import { Post } from "entity/post.entity";
import { PolymorphicParent } from "typeorm-polymorphic";

export enum ViewLogEntityType {
  Post = "Post",
}

@Entity("view_logs")
export class ViewLog implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.viewLogs, { lazy: true })
  user: User;

  @Column({
    nullable: true,
    comment: "會員編號",
  })
  userId: number;

  @PolymorphicParent(() => [Post])
  post: Post;

  @Column()
  entityId: number;

  @Column()
  entityType: string;

  @CreateDateColumn({
    comment: "觀看的時間",
  })
  createdAt: Date;
}
