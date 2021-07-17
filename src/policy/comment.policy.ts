import { Service } from "typedi";
import { User } from "entity/user.entity";
import { Comment } from "entity/comment.entity";

@Service()
export default class CommentPolicy {
  public delete(user: User, comment: Comment) {
    return user.id === comment.userId;
  }

  public update(user: User, comment: Comment) {
    return this.delete(user, comment);
  }
}
