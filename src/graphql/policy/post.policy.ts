// node_modules
import { Service } from "typedi";

// entity
import { User } from "entity/user.entity";
import { Post } from "entity/post.entity";

@Service()
export default class PostPolicy {
  /**
   * 更新文章規則
   * @param user
   * @param post
   */
  public updateRule(user: User, post: Post) {
    return user.id === post.userId;
  }

  /**
   * 刪除文章規則
   * @param user
   * @param post
   */
  public deleteRule(user: User, post: Post) {
    return user.id === post.userId;
  }
}
