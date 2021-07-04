import supertest from "supertest";
import dotenv from "dotenv";
import path from "path";
import argon2 from "argon2";

import { getConnection } from "typeorm";
import { User } from "entity/user.entity";
import { randomBytes } from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// process.env.API_URL;

import app from "../src/app";

export const server = app.listen(process.env.APP_PORT);

export const api = supertest(process.env.API_URL);

interface IRegisterPayload {
  account: string;
  password: string;
  email: string;
}

let fakeUser: IRegisterPayload = {
  account: "garyng01",
  password: "123456",
  email: "garyng01@gmail.com",
};

/**
 * 新增會員
 * @param payload
 */
export const createUser = async (payload: IRegisterPayload = fakeUser): Promise<User | undefined> => {
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

  return await getConnection("test")
    .getRepository(User)
    .findOne({
      where: {
        account: payload.account,
      },
    });
};

export const defaultPassword = "123456";
