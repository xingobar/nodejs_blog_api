import { User } from "entity/user.entity";
import { Repository, EntityRepository } from "typeorm";
import { ICreateUser } from "@src/interface/auth.interface";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  /**
   * 新建使用者
   * @param {ICreateUser} data 要先增的會員資料
   * @return {User}
   */
  createUser(data: ICreateUser) {
    const user = this.create(data);
    return this.save(user);
  }

  /**
   * 根據電子信箱取得會員
   * @param {string} email 電子信箱
   */
  findByEmail(email: string) {
    return this.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * 根據帳號取得會員
   * @param {string} account 帳號
   */
  findByAccount(account: string) {
    return this.findOne({
      where: {
        account,
      },
    });
  }
}
