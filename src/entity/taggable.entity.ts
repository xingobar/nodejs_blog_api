import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PolymorphicChildInterface } from "interface/polymorphic.child.interface";
import { Tag } from "entity/tag.entity";
import { Post } from "entity/post.entity";
import { PolymorphicParent } from "typeorm-polymorphic";

@Entity("taggables")
export class Taggable implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.tags, { lazy: true })
  post: Post;

  @Column({
    comment: "文章編號",
  })
  postId: number;

  @PolymorphicParent(() => [Tag])
  tag: Tag;

  @Column()
  entityId: number;

  @Column()
  entityType: string;
}
