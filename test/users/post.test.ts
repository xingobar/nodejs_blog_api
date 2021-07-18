import Faker from "faker";
import { api, createUser, createUserAndLogin, fakeLogin } from "../global.test";
import { getConnection } from "typeorm";
import { useRefreshDatabase } from "typeorm-seeding";
import { assert } from "chai";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";

export const createPost = async ({
  status = PostStatus.PUBLISH,
  user = undefined,
}: {
  status: PostStatus;
  user?: User | undefined;
}): Promise<Post | undefined> => {
  if (!user) {
    user = await createUser();
  }

  await getConnection("test")
    .createQueryBuilder()
    .insert()
    .into(Post)
    .values({
      title: "demo",
      body: "demo",
      userId: user?.id,
      status,
    })
    .execute();

  const post = await getConnection("test")
    .getRepository(Post)
    .createQueryBuilder()
    .where("userId = :userId", { userId: user?.id })
    .getOne();

  return post;
};

describe("get user posts", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .get("/users/posts")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no posts", async () => {
    const user = await createUser();
    const token = await fakeLogin(user?.account);

    const res = await api.get("/users/posts").set("authorization", `Bearer ${token}`).expect(200);

    assert.equal(res.body.data.length, 0);
  });

  it("check user has only one post", async () => {
    const user = await createUser();
    const token = await fakeLogin(user?.account);
    await createPost({ status: PostStatus.PUBLISH, user });

    const res = await api.get("/users/posts").set("authorization", `Bearer ${token}`).expect(200);

    assert.equal(res.body.data.length, 1);
  });
});
