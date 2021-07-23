import { Service } from "typedi";
import UserRepository from "repository/user.repository";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export default class PermissionService {
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository
  ) {}

  /**
   * 檢查是否有權限
   *
   * @param {number} userId - 會員編號
   * @param {string} action - 操作
   */
  public async checkPermissionByUserId(userId: number, action: string) {
    const user = await this.userRepository
      .getOne()
      .where((u) => u.id)
      .equal(userId)
      .include((u) => u.permissions)
      .joinAlso((u) => u.permissions)
      .where((p) => p.action)
      .equal(action);

    return user.permissions.length > 0;
  }
}
