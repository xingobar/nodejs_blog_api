import { api, createUser, defaultPassword, fakeLogin, getCurrentUser, createUserAndLogin } from "../global.test";
import { expect } from "chai";
import { getConnection } from "typeorm";
import { User } from "entity/user.entity";
import { ProfileGender, Profile } from "entity/profile.entity";
import { useRefreshDatabase, tearDownDatabase } from "typeorm-seeding";
import Faker from "faker";

let jwtToken: string;

const profilePayload: {
  gender?: string;
  phone?: string;
} = {};

export const createProfile = async () => {
  const profile = await getConnection("test").getRepository(Profile).create({
    phone: Faker.phone.phoneNumber(),
    gender: ProfileGender.FEMALE,
  });

  const user =
    (await getConnection("test")
      .getRepository(User)
      .findOne({
        where: {
          id: getCurrentUser?.id,
        },
      })) ?? new User();

  user.profileId = profile.id;

  await getConnection("test").getRepository(User).update(
    {
      id: user.id,
    },
    {
      profileId: profile.id,
    }
  );

  return profile;
};

describe("store profile test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
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

  it("no input data", async () => {
    const token = await createUserAndLogin();
    const res = await api
      .post("/users/profiles")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(res.body).that.deep.equals({ errors: [{ message: "請輸入性別" }] });
  });

  it("gender error", async () => {
    const token = await createUserAndLogin();
    profilePayload.gender = "demo";
    const res = await api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send(profilePayload);

    expect(res.body).that.deep.equals({ errors: [{ message: "性別有誤" }] });
  });

  it("no phone", async () => {
    const token = await createUserAndLogin();
    profilePayload.gender = ProfileGender.MALE;
    const res = await api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .expect(400)
      .send(profilePayload);
    expect(res.body).that.deep.equals({ errors: [{ message: "請輸入電話號碼" }] });
  });

  it("store profile successful", async () => {
    const token = await createUserAndLogin();
    profilePayload.phone = "123456";
    const res = await api
      .post("/users/profiles")
      .set("accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send(profilePayload)
      .expect(200);
  });
});

describe("update profile test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
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

  it("no input data", async () => {
    const token = await createUserAndLogin();

    const res = await api
      .post("/users/profiles")
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send({})
      .expect(400);
    expect(res.body).that.deep.equals({ errors: [{ message: "請輸入性別" }] });
  });

  it("update profile", async () => {
    const token = await createUserAndLogin();

    const profile = await getConnection("test").getRepository(Profile).create({
      phone: Faker.phone.phoneNumber(),
      gender: ProfileGender.FEMALE,
    });

    await getConnection("test")
      .getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({
        profileId: profile.id,
      })
      .execute();

    api.post("/users/profiles").set("accept", "application/json").set("authorization", `Bearer ${token}`).send(profilePayload).expect(200);
  });
});

describe("get profile", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
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

  it("create profile", async () => {
    const token = await createUserAndLogin();
    api.post("/users/profiles").set("accept", "application/json").set("authorization", `Bearer ${token}`).send(profilePayload).expect(200);
  });

  it("get profile", async () => {
    const profile = await createProfile();
    const user = await getConnection("test")
      .getRepository(User)
      .createQueryBuilder()
      .where("profileId = :profileId", { profileId: profile.id })
      .getOne();

    const token = await fakeLogin(user?.account);
    api.get("/users/profiles").set("accept", "application/json").set("authorization", `Bearer ${token}`).expect(200);
  });
});
