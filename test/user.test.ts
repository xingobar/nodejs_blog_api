import supertest from "supertest";
import Faker from "faker";
import { expect } from "chai";
import dotenv from "dotenv";
import { getConnection } from "typeorm";
import path from "path";
import { User } from "entity/user.entity";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

import server from "../src/index";

// process.env.API_URL;
const api = supertest(process.env.API_URL);
// let apiToken;

describe("auth", () => {
  before((done) => {
    getConnection("test").runMigrations();
    done();
  });

  afterEach(() => {
    getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
  });

  it("register", (done) => {
    let payload: {
      account?: string;
      password?: string;
      email?: string;
      confirmPassword?: string;
    } = {};

    const apiPrefix = api.post("/auth/register").set("Accept", "application/json");

    // 帳號沒有輸入
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入帳號" }] });
      });

    payload = {
      account: "123",
    };
    // 帳號長度過小
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "帳號至少要 6 位" }] });
      });

    // 帳號長度過大
    payload = {
      account: Faker.lorem.words(30),
    };
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "帳號至多 20 位" }] });
      });

    // 沒有輸入信箱
    payload.account = Faker.lorem.word(15);

    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入電子郵件" }] });
      });

    // 信箱格式不符
    payload.email = "test";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "電子郵件格式不符" }] });
      });

    // 密碼長度驗證, 密碼長度不夠
    payload.email = Faker.internet.email();
    payload.password = "123";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "密碼至少要 6 位" }] });
      });

    // 密碼長度過長
    payload.password = Faker.internet.password(30);
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "密碼至多 12 位" }] });
      });

    // 確認密碼尚未輸入
    payload.password = "123456";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入確認密碼" }] });
      });

    // 密碼不一致
    payload.confirmPassword = "123";
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "密碼不一致" }] });
      });

    payload.confirmPassword = payload.password;

    // 註冊成功
    api
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(payload)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  // it("login", (done) => {
  //   api
  //     .post("/auth/login")
  //     .set("Accept", "application/json")
  //     .send({
  //       account: "garyng02",
  //       password: "123456",
  //     })
  //     .expect(200)
  //     .end((err, res) => {
  //       console.log("end => ", res.body);
  //       apiToken = res.body.token;
  //       expect(res.body).to.property("token");
  //       done();
  //     });
  // });

  after((done) => {
    server.close();
    done();
  });
});
