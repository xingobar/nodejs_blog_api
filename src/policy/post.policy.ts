import { Service } from "typedi";
import { User } from "entity/user.entity";
import { Post } from "entity/post.entity";

@Service()
export default class PostPolicy {
  public update(user: User, post: Post) {
    return user.id === post.userId;
  }
}
