import argon2 from "argon2";
import UserRepository from "repository/user.repository";

import { IAuthInput, ICreateUser } from "@src/interface/auth.interface";
import { randomBytes } from "crypto";
import { getCustomRepository } from "typeorm";
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

    const data: ICreateUser = {
      ...payload,
      password: hashedPassword,
    };

    const user: User = await this.userRepository.createUser(data);

    return user;
  }
}
