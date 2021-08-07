import argon2 from "argon2";
import UserRepository from "repository/user.repository";
import InvalidException from "exception/invalid.exception";
import jwt from "jsonwebtoken";
import config from "config/index";

import { IAuthInput, ICreateUser, IAuthLogin } from "interface/auth.interface";
import { randomBytes } from "crypto";
import { User } from "entity/user.entity";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
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
   * 產生 refresh token
   * @param user
   */
  public generateRefreshJwtToken(user: User): string {
    return jwt.sign({ ...user }, config.jwt.secret || randomBytes(20).toString("hex"), { expiresIn: "1days" });
  }

  /**
   * 根據帳號取得會員資料
   * @param account
   * @param relations
   */
  public findByAccount(account: string) {
    return this.userRepository.findByAccount(account);
  }

  /**
   * 檢查密碼
   * @param {IAuthLogin} payload
   * @returns {boolean}
   */
  public async checkPasswordMatch(payload: IAuthLogin): Promise<boolean> {
    const userWithPassword = await this.userRepository.findByAccountWithPassword(payload.account);
    return await argon2.verify(userWithPassword.password, payload.password);
  }

  /**
   * 根據電子信箱取得帳號
   * @param {string} email 信箱
   */
  public findByEmail(email: string) {
    return this.userRepository
      .getOne()
      .where((u) => u.email)
      .equal(email);
  }

  /**
   * 取得所有使用者
   */
  public getAllUsers() {
    return this.userRepository.getAll().orderByDescending((u) => u.createdAt);
  }

  /**
   * 根據會員編號取得會員
   * @param id
   */
  public findByIds(id: number[]) {
    return this.userRepository
      .getAll()
      .where((u) => u.id)
      .in(id);
  }

  /**
   * 根據編號取得會員
   * @param {number} id - 會員編號
   */
  public async findById(id: number) {
    return await this.userRepository.createQueryBuilder("users").where("id = :id", { id }).getOne();
  }
}
