import argon2 from "argon2";
import UserRepository from "repository/user.repository";
import InvalidException from "exception/invalid.exception";
import jwt from "jsonwebtoken";
import config from "config/index";

import { IAuthInput, ICreateUser } from "@src/interface/auth.interface";
import { randomBytes } from "crypto";
import { User } from "entity/user.entity";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export default class UserService {
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository
  ) {}

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
   * @param email
   */
  public generateJwtToken(user: User): string {
    return jwt.sign({ email: user.email }, config.jwt.secret || randomBytes(20).toString("hex"), { expiresIn: "1h" });
  }
}
