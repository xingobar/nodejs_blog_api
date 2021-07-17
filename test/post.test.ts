import { expect, assert } from "chai";
import { getConnection } from "typeorm";
import { api, createUser, createUserAndLogin, getCurrentUser, fakeLogin } from "./global.test";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";
import { useRefreshDatabase } from "typeorm-seeding";
import { ViewLog } from "entity/view.log.entity";

let post: Post | undefined;

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

  post = await getConnection("test").getRepository(Post).createQueryBuilder().where("userId = :userId", { userId: user?.id }).getOne();

  return post;
};

describe("get post index ", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no posts", (done) => {
    api
      .get("/posts")
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.length, 0);
        done();
      });
  });

  it("post draft", (done) => {
    createPost({ status: PostStatus.DRAFT });
    api
      .get("/posts")
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.length, 0);
        done();
      });
  });

  it("check post length", async () => {
    await createPost({ status: PostStatus.PUBLISH });
    const res = await api.get("/posts").expect(200);
    assert.equal(res.body.length, 1);
  });
});

describe("show post", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("post not found", () => {
    api.get("/posts/1").expect(404);
  });

  it("get post", async () => {
    const user = await createUser();
    const token = await fakeLogin(user?.account);
    const post = await createPost({ status: PostStatus.PUBLISH });

    const res = await api.get(`/posts/${post?.id}`).set("authorization", `Bearer ${token}`).expect(200);

    // 檢查 view logs 是否有資料
    const viewLog = await getConnection("test")
      .getRepository(ViewLog)
      .createQueryBuilder()
      .where("userId = :userId", { userId: user?.id })
      .where("entityId = :entityId", { entityId: post?.id })
      .getOne();

    assert.exists(viewLog);
  });
});

describe("like post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });
  it("no login", (done) => {
    api
      .post("/posts/1/likes")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("not found post", async () => {
    const token = await createUserAndLogin();

    await api.post("/posts/1/likes").set("authorization", `Bearer ${token}`).expect(404);
  });

  it("get 404 not found when like unpublished post", async () => {
    const token = await createUserAndLogin();
    const post = await createPost({ status: PostStatus.DRAFT });

    await api.post(`/posts/${post?.id}/likes`).set("authorization", `Bearer ${token}`).expect(404);
  });

  it("like post and unlike", async () => {
    const user = await createUser();
    const token = await fakeLogin(user?.account);
    const post = await createPost({ status: PostStatus.PUBLISH });

    // 測試喜歡文章
    const res = await api.post(`/posts/${post?.id}/likes`).set("authorization", `Bearer ${token}`).expect(200);

    assert.equal(res.body.status, true);

    // 取消喜歡文章
    const unlikeRes = await api.post(`/posts/${post?.id}/likes`).set("authorization", `Bearer ${token}`).expect(200);

    assert.equal(unlikeRes.body.status, false);
  });
});
