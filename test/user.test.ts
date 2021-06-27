import supertest from "supertest";
import Faker from "faker";
import { expect } from "chai";

const api = supertest("http://localhost:8001/api");
let apiToken;

describe("auth", () => {
  it("register", (done) => {
    let payload = {};
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
        done();
      });
  });

  it("login", (done) => {
    api
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        account: "garyng02",
        password: "123456",
      })
      .expect(200)
      .end((err, res) => {
        console.log("end => ", res.body);
        apiToken = res.body.token;
        expect(res.body).to.property("token");
        done();
      });
  });
});
