// node_modules
import { Service } from "typedi";

// entity
import { User } from "entity/user.entity";
import { Comment } from "entity/comment.entity";

@Service()
export default class CommentPolicy {
  public commentDeleteRule(user: User, comment: Comment) {
    return user.id === comment.userId;
  }
}
