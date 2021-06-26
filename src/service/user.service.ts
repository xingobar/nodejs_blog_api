import { IAuthInput, ICreateUser } from "@src/interface/auth.interface";
import argon2 from "argon2";
import { randomBytes } from "crypto";
import { createUser } from "repository/user.repository";
import { User } from "entity/user.entity";

export default class UserService {
  public async createUser(payload: IAuthInput): Promise<User> {
    const salt = randomBytes(20);

    const hashedPassword = await argon2.hash(payload.password, { salt });

    const data: ICreateUser = {
      ...payload,
      password: hashedPassword,
    };

    const user: User = await createUser(data);

    return user;
  }
}
