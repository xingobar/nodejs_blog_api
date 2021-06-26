import { Service } from "typedi";
import { User } from "entity/user.entity";

@Service()
export default class ProfilePolicy {
  /**
   * 是否編輯自己的資料
   * @param user
   * @param userId
   */
  public update(user: User, userId: number): boolean {
    return user.id === userId;
  }
}
