import argon2 from "argon2";
import UserRepository from "repository/user.repository";
import InvalidException from "exception/invalid.exception";
import jwt from "jsonwebtoken";
import config from "config/index";

import { IAuthInput, ICreateUser, IAuthLogin } from "@src/interface/auth.interface";
import { randomBytes } from "crypto";
import { User } from "entity/user.entity";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service({
  transient: true,
})
export default class UserService {
  constructor(
    @InjectRepository(config.connectionName)
    private readonly userRepository: UserRepository
  ) {}

  /**
   * 創建會員
   * @param {IAuthInput} payload
   * @param payload
   */
  public async createUser(payload: IAuthInput): Promise<User> {
    const salt = randomBytes(20);

    const hashedPassword = await argon2.hash(payload.password, { salt });

    // 電子信箱檢查
    if ((await this.userRepository.findByEmail(payload.email)) !== undefined) {
      throw new InvalidException("電子信箱已存在");
    }

    // 檢查帳號
    if ((await this.userRepository.findByAccount(payload.account)) !== undefined) {
      throw new InvalidException("帳號已存在");
    }

    const data: ICreateUser = {
      ...payload,
      password: hashedPassword,
    };

    // 新增會員
    const user: User = await this.userRepository.createUser(data);

    return user;
  }

  /**
   * 產生 jwt token
   * @param {User} user
   */
  public generateJwtToken(user: User): string {
    return jwt.sign({ ...user }, config.jwt.secret || randomBytes(20).toString("hex"), { expiresIn: "1h" });
  }

  /**
   * 登入
   * @param {IAuthLogin} payload
   */
  public async login(payload: IAuthLogin) {
    // 檢查帳號是否存在
    const user: User = await this.userRepository.findByAccount(payload.account);
    if (!user) {
      throw new InvalidException("帳號不存在");
    }

    const userWithPassword = await this.userRepository.findByAccountWithPassword(payload.account);

    // 檢查密碼是否正確
    if (await argon2.verify(userWithPassword.password, payload.password)) {
      // 回傳 token
      return this.generateJwtToken(user);
    } else {
      throw new InvalidException("密碼錯誤");
    }
  }

  /**
   * 根據帳號取得會員資料
   * @param account
   * @param relations
   */
  public findByAccount(account: string) {
    return this.userRepository.findByAccount(account);
  }
}
