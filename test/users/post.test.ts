import Faker from "faker";
import { api, createUser, createUserAndLogin, fakeLogin } from "../global.test";
import { getConnection } from "typeorm";
import { useRefreshDatabase } from "typeorm-seeding";
import { assert } from "chai";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";

export const createPost = async ({ status = PostStatus.PUBLISH, user = undefined }: { status: PostStatus; user?: User | undefined }) => {
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

  return { user, post };
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

describe("create user post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .post("/users/posts")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no input data", async () => {
    const payload: {
      title?: string;
      body?: string;
      status?: string;
    } = {};
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });
    const token = await fakeLogin(user?.account);

    // 沒有輸入標題
    let res = await api.post("/users/posts").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入標題" }] });

    // 內容沒有輸入
    payload.title = Faker.lorem.paragraph(2);

    res = await api.post("/users/posts").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入文章內容" }] });

    // 內容長度不夠
    payload.body = "demo";

    res = await api.post("/users/posts").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "內容至少要 50 個字" }] });

    // 沒有輸入狀態
    payload.body = Faker.lorem.paragraph(2);

    res = await api.post("/users/posts").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入狀態" }] });

    // 文章狀態有誤
    payload.status = "demo";

    res = await api.post("/users/posts").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "文章狀態有誤" }] });
  });

  it("create post successful", async () => {
    const payload: {
      title?: string;
      body?: string;
      status?: string;
    } = {
      title: Faker.lorem.paragraph(1),
      body: Faker.lorem.paragraph(2),
      status: PostStatus.PUBLISH,
    };
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });
    const token = await fakeLogin(user?.account);

    await api.post("/users/posts").set("authorization", `Bearer ${token}`).send(payload).expect(200);
  });
});

describe("update user post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });
  it("no login", (done) => {
    api
      .put("/users/posts/1")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no input data", async () => {
    const token = await createUserAndLogin();
    const payload: {
      title?: string;
      body?: string;
      status?: string;
    } = {};

    let res = await api.put("/users/posts/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入標題" }] });

    // 內容沒有輸入
    payload.title = Faker.lorem.paragraph(1);

    res = await api.put("/users/posts/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入文章內容" }] });

    // 內容長度不夠
    payload.body = "demo";

    res = await api.put("/users/posts/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "內容至少要 50 個字" }] });

    // 沒有輸入狀態
    payload.body = Faker.lorem.paragraph(2);

    res = await api.put("/users/posts/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入狀態" }] });

    // 文章狀態有誤
    payload.status = "demo";

    res = await api.put("/users/posts/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "文章狀態有誤" }] });
  });

  it("not found post", async () => {
    const payload: {
      title?: string;
      body?: string;
      status?: string;
    } = {
      title: Faker.lorem.paragraph(1),
      body: Faker.lorem.paragraph(2),
      status: PostStatus.PUBLISH,
    };

    const token = await createUserAndLogin();

    await api.put(`/users/posts/1`).set("authorization", `Bearer ${token}`).send(payload).expect(404);
  });

  it("only update own post", async () => {
    const payload: {
      title?: string;
      body?: string;
      status?: string;
    } = {
      title: Faker.lorem.paragraph(1),
      body: Faker.lorem.paragraph(2),
      status: PostStatus.PUBLISH,
    };

    const { post, user } = await createPost({ status: PostStatus.PUBLISH });

    const otherUserToken = await createUserAndLogin();

    await api.put(`/users/posts/${post?.id}`).set("authorization", `Bearer ${otherUserToken}`).send(payload).expect(403);
  });

  it("update post success", async () => {
    const payload: {
      title?: string;
      body?: string;
      status?: string;
    } = {
      title: Faker.lorem.paragraph(1),
      body: Faker.lorem.paragraph(2),
      status: PostStatus.PUBLISH,
    };

    const { post, user } = await createPost({ status: PostStatus.PUBLISH });

    const token = await fakeLogin(user?.account);

    await api.put(`/users/posts/${post?.id}`).set("authorization", `Bearer ${token}`).send(payload).expect(200);
  });
});

describe("delete post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .delete("/users/posts/1")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("not found post", async () => {
    const token = await createUserAndLogin();

    await api.delete("/users/posts/1").set("authorization", `Bearer ${token}`).expect(404);
  });

  it("no delete other user post", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });

    const otherUserToken = await createUserAndLogin();

    await api.delete(`/users/posts/${post?.id}`).set("authorization", `Bearer ${otherUserToken}`).expect(403);
  });

  it("delete post successful", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });
    const token = await fakeLogin(user?.account);

    await api.delete(`/users/posts/${post?.id}`).set("authorization", `Bearer ${token}`).expect(200);
  });
});

describe("user bookmarked post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .get("/users/posts/bookmarks")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no bookmark", async () => {
    const token = await createUserAndLogin();
    const res = await api.get("/users/posts/bookmarks").set("authorization", `Bearer ${token}`).expect(200);

    assert.equal(res.body.data.length, 0);
  });

  it("check post bookmark", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });
    const token = await fakeLogin(user?.account);

    await getConnection("test")
      .getRepository(Bookmark)
      .createQueryBuilder()
      .insert()
      .into(Bookmark)
      .values({
        userId: user?.id,
        entityId: post?.id,
        entityType: BookmarkEntityType.Post,
      })
      .execute();

    const res = await api.get("/users/posts/bookmarks").set("authorization", `Bearer ${token}`).expect(200);

    assert.equal(res.body.data.length, 1);
  });
});
