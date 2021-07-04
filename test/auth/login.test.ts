import { server, api, createUser, defaultPassword } from "../global.test";
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
  before((done) => {
    done();
    // server = app.listen(process.env.APP_PORT);
    // getConnection("test").runMigrations();
  });

  after(() => {
    getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
    // server.close();
    // done();
  });

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
    payload.account = "12345";

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

  it("register", (done) => {
    createUser().then((user) => {
      fakeUser = user;
      done();
    });
  });

  it("login successful", (done) => {
    api
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        account: fakeUser?.account,
        password: defaultPassword,
      })
      .end((err, res) => {
        expect(res.body).includes.keys("token");
        apiToken = res.body?.token;
        done();
      });
  });

  it("check can login", (done) => {
    api
      .get("/users")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${apiToken}`)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});
