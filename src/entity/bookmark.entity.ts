import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PolymorphicChildInterface } from "interface/polymorphic.child.interface";
import { PolymorphicParent } from "typeorm-polymorphic";
import { Post } from "entity/post.entity";
import { User } from "entity/user.entity";

export enum BookmarkEntityType {
  Post = "Post",
}

@Entity("bookmarks")
export class Bookmark implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { lazy: true })
  user: User;

  @Column({
    nullable: true,
  })
  userId: number;

  @PolymorphicParent(() => [Post])
  post: Post;

  @Column()
  entityId: number;

  @Column()
  entityType: string;
}
