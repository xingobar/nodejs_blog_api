import { api, createUser, defaultPassword, fakeLogin, getCurrentUser } from "../global.test";
import { expect } from "chai";
import { getConnection } from "typeorm";
import { User } from "entity/user.entity";
import { ProfileGender, Profile } from "entity/profile.entity";
import { useRefreshDatabase, tearDownDatabase } from "typeorm-seeding";

let jwtToken: string;

const profilePayload: {
  gender?: string;
  phone?: string;
} = {};

describe("store profile test", () => {
  after((done) => {
    getConnection("test").getRepository(Profile).createQueryBuilder().delete().execute();
    getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
    done();
  });

  it("create user", (done) => {
    createUser().then(() => {
      done();
    });
  });

  it("login", (done) => {
    fakeLogin().then((token) => {
      jwtToken = token;
      done();
    });
  });

  it("no login", (done) => {
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .send({})
      .expect(401)
      .end((err, res) => {
        done();
      });
  });

  it("no input data", (done) => {
    api
      .post("/users/profiles")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send({})
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入性別" }] });
        done();
      });
  });

  it("gender error", (done) => {
    profilePayload.gender = "demo";
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send(profilePayload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "性別有誤" }] });
        done();
      });
  });

  it("no phone", (done) => {
    profilePayload.gender = ProfileGender.MALE;
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send(profilePayload)
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入電話號碼" }] });
        done();
      });
  });

  it("store profile successful", (done) => {
    profilePayload.phone = "123456";
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send(profilePayload)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});

describe("update profile", () => {
  after((done) => {
    getConnection("test").getRepository(Profile).createQueryBuilder().delete().execute();
    getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
    done();
  });

  it("create user", (done) => {
    createUser().then(() => {
      done();
    });
  });

  it("login", (done) => {
    fakeLogin().then((token) => {
      jwtToken = token;
      done();
    });
  });

  it("no login", (done) => {
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .send({})
      .expect(401)
      .end((err, res) => {
        done();
      });
  });

  it("no input data", (done) => {
    api
      .post("/users/profiles")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send({})
      .end((err, res) => {
        expect(res.body).that.deep.equals({ errors: [{ message: "請輸入性別" }] });
        done();
      });
  });

  it("create profile", (done) => {
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send(profilePayload)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  it("update profile", (done) => {
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send(profilePayload)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});

describe("get profile", () => {
  after((done) => {
    getConnection("test").getRepository(Profile).createQueryBuilder().delete().execute();
    getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
    done();
  });

  it("no login", (done) => {
    api
      .get("/users/profiles")
      .set("accept", "application/json")
      .send({})
      .expect(401)
      .end((err, res) => {
        done();
      });
  });

  it("create user", (done) => {
    createUser().then(() => {
      done();
    });
  });

  it("login", (done) => {
    fakeLogin().then((token) => {
      jwtToken = token;
      done();
    });
  });

  it("get profile", (done) => {
    api
      .get("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(404)
      .end((err, res) => {
        done();
      });
  });

  // it("create profile", async (done) => {
  //   const profile = await getConnection("test")
  //     .getRepository(Profile)
  //     .create({
  //       ...profilePayload,
  //     });

  //   const user =
  //     (await getConnection("test")
  //       .getRepository(User)
  //       .findOne({
  //         where: {
  //           id: getCurrentUser?.id,
  //         },
  //       })) ?? new User();

  //   user.profileId = profile.id;

  //   await getConnection("test").getRepository(User).update(
  //     {
  //       id: user.id,
  //     },
  //     {
  //       profileId: profile.id,
  //     }
  //   );
  //   //done();
  // });

  it("create profile", (done) => {
    api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .send(profilePayload)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  it("get profile", (done) => {
    api
      .get("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${jwtToken}`)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});
