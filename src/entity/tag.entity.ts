import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Taggable } from "entity/taggable.entity";
import { Post } from "entity/post.entity";
import { PolymorphicChildren } from "typeorm-polymorphic";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "title",
    comment: "標籤名稱",
  })
  title: string;

  @Column({
    name: "alias",
    comment: "別名",
  })
  alias: string;

  @PolymorphicChildren(() => Taggable, {
    eager: false,
  })
  post: Post;
}
