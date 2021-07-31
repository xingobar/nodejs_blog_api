import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { PolymorphicChildInterface } from "interface/polymorphic.child.interface";
import { Tag } from "entity/tag.entity";
import { Post } from "entity/post.entity";
import { PolymorphicParent } from "typeorm-polymorphic";

export enum TaggableEntityType {
  Tag = "Tag",
}

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
  @OneToOne(() => Tag)
  @JoinColumn({ name: "entityId" })
  tag: Tag;

  @Column()
  entityId: number;

  @Column()
  entityType: string;
}
