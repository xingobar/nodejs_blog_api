import { api } from "../global.test";

import Faker from "faker";
import { expect } from "chai";

import { getConnection } from "typeorm";

import { User } from "entity/user.entity";

import { useRefreshDatabase } from "typeorm-seeding";

let registerPayload: {
  account?: string;
  password?: string;
  email?: string;
  confirmPassword?: string;
} = {};

describe("register", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("account no input", (done) => {
    // 帳號沒有輸入
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({})
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入帳號" }] });
        done();
      });
  });

  it("account min", (done) => {
    registerPayload = {
      account: "123",
    };
    // 帳號長度過小
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "帳號至少要 6 位" }] });
        done();
      });
  });

  it("account max", (done) => {
    // 帳號長度過大
    registerPayload = {
      account: Faker.lorem.words(30),
    };
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "帳號至多 20 位" }] });
        done();
      });
  });

  it("no email input", (done) => {
    // // 沒有輸入信箱
    registerPayload.account = "garyng01";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入電子郵件" }] });
        done();
      });
  });

  it("email invalid", (done) => {
    // // 信箱格式不符
    registerPayload.email = "test";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "電子郵件格式不符" }] });
        done();
      });
  });

  it("password min", (done) => {
    // // 密碼長度驗證, 密碼長度不夠
    registerPayload.email = Faker.internet.email();
    registerPayload.password = "123";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "密碼至少要 6 位" }] });
        done();
      });
  });

  it("password max", (done) => {
    // // 密碼長度過長
    registerPayload.password = Faker.internet.password(30);
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "密碼至多 12 位" }] });
        done();
      });
  });

  it("no confirm password", (done) => {
    // // 確認密碼尚未輸入
    registerPayload.password = "123456";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入確認密碼" }] });
        done();
      });
  });

  it("password mismatch", (done) => {
    // // 密碼不一致
    registerPayload.confirmPassword = "123";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .expect(400)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "密碼不一致" }] });
        done();
      });
  });

  it("register success", (done) => {
    // // 註冊成功
    registerPayload = {
      account: Faker.finance.account(),
      password: "123456",
      email: Faker.internet.email(),
      confirmPassword: "123456",
    };
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(registerPayload)
      .end((err, res) => {
        done();
      });
  });

  // after((done) => {
  //   server.close();
  //   done();
  // });
});
