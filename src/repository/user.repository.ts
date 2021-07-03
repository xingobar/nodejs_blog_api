import { User } from "entity/user.entity";
import { RepositoryBase } from "typeorm-linq-repository";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { ICreateUser } from "@src/interface/auth.interface";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export default class UserRepository extends RepositoryBase<User> {
  constructor() {
    super(User);
  }

  /**
   * 新建使用者
   * @param {ICreateUser} data 要先增的會員資料
   * @return {User}
   */
  createUser(data: ICreateUser) {
    return this.create(<User>{
      ...data,
    });
  }

  /**
   * 根據電子信箱取得會員
   * @param {string} email 電子信箱
   */
  findByEmail(email: string) {
    return this.getOne().where((user) => {
      return user.email === email;
    });
  }

  /**
   * 根據帳號取得會員
   * @param {string} account 帳號
   */
  findByAccount(account: string) {
    return this.getOne()
      .where((user) => user.account)
      .equal(account);
  }

  /**
   * 抓取會員且有密碼
   * @param {string} account 帳號
   */
  findByAccountWithPassword(account: string) {
    return getRepository(User).createQueryBuilder("users").addSelect("users.password").getRawOne();
  }
}
