import { User } from "entity/user.entity";
import { Repository, EntityRepository, getRepository } from "typeorm";
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
  findByAccount(account: string, relations: string[] = []) {
    return this.findOne({
      where: {
        account,
      },
      relations,
    });
  }

  /**
   * 抓取會員且有密碼
   * @param {string} account 帳號
   */
  findByAccountWithPassword(account: string) {
    return getRepository(User).createQueryBuilder("users").addSelect("users.password").getRawOne();
  }
}
