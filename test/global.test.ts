import supertest from "supertest";
import dotenv from "dotenv";
import path from "path";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { getConnection } from "typeorm";
import { User } from "entity/user.entity";
import { randomBytes } from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// process.env.API_URL;

import app from "../src/app";
import Faker from "faker";

export const server = app.listen(process.env.APP_PORT);

export const api = supertest(process.env.API_URL);

interface IRegisterPayload {
  account: string;
  password: string;
  email: string;
}

const fakeUser: IRegisterPayload = {
  account: Faker.finance.account(),
  password: "123456",
  email: Faker.internet.email(),
};

let currentUser: User = new User();

/**
 * 新增會員
 * @param payload
 */
export const createUser = async (
  payload: IRegisterPayload = {
    account: Faker.finance.account(),
    password: "123456",
    email: Faker.internet.email(),
  }
): Promise<User | undefined> => {
  const salt = randomBytes(20);
  const hashedPassword = await argon2.hash(payload.password, { salt });
  payload.password = hashedPassword;

  await getConnection("test")
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({
      ...payload,
    })
    .execute();

  currentUser =
    (await getConnection("test")
      .getRepository(User)
      .findOne({
        where: {
          account: payload.account,
        },
      })) ?? new User();

  return currentUser;
};

// 預設密碼
export const defaultPassword = "123456";

// 取得目前使用者
export const getCurrentUser = currentUser;

/**
 * 產生 jwt token
 * @param account
 */
export const fakeLogin = async (account?: string): Promise<string> => {
  let user: User | undefined;
  if (!account) {
    user = await getConnection("test")
      .getRepository(User)
      .findOne({
        where: {
          account: account ? account : currentUser?.account,
        },
      });
  } else {
    user = await getConnection("test").getRepository(User).findOne({
      where: {
        account,
      },
    });
  }

  return jwt.sign({ ...user }, process.env.TOKEN_SECRET || randomBytes(20).toString("hex"), { expiresIn: "1h" });
};

// 新增並且登入
export const createUserAndLogin = async () => {
  await createUser();
  return await fakeLogin();
};
