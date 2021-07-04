import { User } from "entity/user.entity";
import { PostStatus } from "entity/post.entity";

// 新增文章
export interface ICreatePost {
  title: string;
  body: string;
  user: User;
  status: PostStatus;
}

// 更新文章
export interface IUpdatePost {
  title: string;
  body: string;
  user: User;
  status: PostStatus;
}
