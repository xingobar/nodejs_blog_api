import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PolymorphicChildInterface } from "interface/polymorphic.child.interface";
import { PolymorphicParent } from "typeorm-polymorphic";
import { User } from "entity/user.entity";
import { Post } from "entity/post.entity";

export const enum LikeableEntityType {
  Post = "Post",
}

@Entity("likeables")
export class Likeable implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.likes, { lazy: true })
  user: User;

  @PolymorphicParent(() => [Post])
  post: Post;

  @Column()
  entityId: number;

  @Column()
  entityType: string;
}
