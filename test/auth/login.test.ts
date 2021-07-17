import { api, createUser, defaultPassword, fakeLogin, createUserAndLogin } from "../global.test";
import { expect } from "chai";
import { getConnection } from "typeorm";
import { User } from "entity/user.entity";

import Faker from "faker";

const payload: {
  account?: string;
  password?: string;
} = {};

let fakeUser: User | undefined;

let apiToken: string;

describe("login test", () => {
  // beforeEach(async () => {
  //   await getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
  // });

  it("no account", (done) => {
    api
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({})
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入登入帳號" }] });
        done();
      });
  });

  it("no password", (done) => {
    payload.account = Faker.finance.account();

    api
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入密碼" }] });
        done();
      });
  });

  it("account not exists", (done) => {
    payload.password = "123456";
    api
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(payload)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal("帳號不存在");
        done();
      });
  });

  it("check can login", async () => {
    fakeUser = await createUser({ account: Faker.finance.account(), password: "123456", email: Faker.internet.email() });
    apiToken = await fakeLogin(fakeUser?.account);

    const res = await api.get("/users").set("Accept", "application/json").set("authorization", `Bearer ${apiToken}`).expect(200);

    expect(res.statusCode).to.be.equal(200);
  });
});
