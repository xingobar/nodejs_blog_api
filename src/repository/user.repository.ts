import { User } from "entity/user.entity";
import { RepositoryBase } from "typeorm-linq-repository";
import { Repository, EntityRepository, getRepository } from "typeorm";
import { ICreateUser } from "@src/interface/auth.interface";
import { Service } from "typedi";
import config from "config/index";

@Service()
@EntityRepository(User)
export default class UserRepository extends RepositoryBase<User> {
  constructor() {
    super(User, {
      connectionName: config.connectionName,
    });
  }

  /**
   * 新建使用者
   * @param {ICreateUser} data 要先增的會員資料
   * @return {User}
   */
  createUser(data: ICreateUser) {
    return this.create({
      ...data,
    } as User);
  }

  /**
   * 根據電子信箱取得會員
   * @param {string} email 電子信箱
   */
  findByEmail(email: string) {
    return this.getOne()
      .where((user) => user.email)
      .equal(email);
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
