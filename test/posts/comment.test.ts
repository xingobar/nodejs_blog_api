import { createUser, api, createUserAndLogin, fakeLogin } from "../global.test";
import { assert } from "chai";
import { useRefreshDatabase } from "typeorm-seeding";

import { User } from "entity/user.entity";
import { Post, PostStatus } from "entity/post.entity";
import { getConnection } from "typeorm";
import { Comment } from "entity/comment.entity";

import Faker from "faker";

// 新增文章
export const createPost = async ({ status = PostStatus.DRAFT }: { status?: PostStatus }): Promise<Post | undefined> => {
  const user = await createUser();

  await getConnection("test")
    .getRepository(Post)
    .createQueryBuilder()
    .insert()
    .into(Post)
    .values({
      title: Faker.lorem.word(10),
      body: Faker.lorem.word(10),
      userId: user?.id,
      status,
    })
    .execute();

  return await getConnection("test").getRepository(Post).createQueryBuilder().where("userId = :userId", { userId: user?.id }).getOne();
};

// 新增平論
export const createComment = async (postId: number | undefined, userId: number | undefined): Promise<Comment | undefined> => {
  await getConnection("test")
    .getRepository(Comment)
    .createQueryBuilder()
    .insert()
    .into(Comment)
    .values({
      userId,
      postId,
      body: Faker.lorem.word(10),
    })
    .execute();

  return await getConnection("test")
    .getRepository(Comment)
    .createQueryBuilder()
    .where("postId = :postId", { postId })
    .where("userId = :userId", { userId })
    .getOne();
};

// 新增文章、使用者以及評論
export const createPostUserComment = async () => {
  const user = await createUser();
  const post = await createPost({ status: PostStatus.PUBLISH });

  const comment = await createComment(post?.id, user?.id);

  return { user, post, comment };
};

describe("post comment test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("not found", (done) => {
    api
      .get("/posts/1/comments")
      .expect(404)
      .end((err, res) => {
        done();
      });
  });

  it("not found when post publish not yet", async () => {
    const post = await createPost({});
    await api.get(`/posts/${post?.id}/comments`).expect(404);
  });

  it("get comment", async () => {
    const user = await createUser();
    const post = await createPost({ status: PostStatus.PUBLISH });

    const comment = await createComment(post?.id, user?.id);

    const res = await api.get(`/posts/${post?.id}/comments`).expect(200);

    assert.equal(res.body.data.length, 1);
  });
});

describe("delete parent comment test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .delete(`/posts/1/comments/1`)
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("not found comments because post not found", async () => {
    const token = await createUserAndLogin();
    await api.delete(`/posts/1/comments/1`).set("authorization", `Bearer ${token}`).expect(404);
  });

  it("not found comments because post published not yet", async () => {
    const token = await createUserAndLogin();
    const post = await createPost({});
    await api.delete(`/posts/${post?.id}/comments/1`).set("authorization", `Bearer ${token}`).expect(404);
  });

  it("not found comments because comment not created", async () => {
    const token = await createUserAndLogin();
    const post = await createPost({ status: PostStatus.PUBLISH });
    await api.delete(`/posts/${post?.id}/comments/1`).set("authorization", `Bearer ${token}`).expect(404);
  });

  it("delete not own comment", async () => {
    const user = await createUser();
    const post = await createPost({ status: PostStatus.PUBLISH });
    const comment = await createComment(post?.id, user?.id);

    const otherUser = await createUser();
    const otherUserToken = await fakeLogin(otherUser?.account);

    await api.delete(`/posts/${post?.id}/comments/${comment?.id}`).set("authorization", `Bearer ${otherUserToken}`).expect(403);
  });

  it("delete own comment successful", async () => {
    const { user, post, comment } = await createPostUserComment();

    const token = await fakeLogin(user?.account);

    await api.delete(`/posts/${post?.id}/comments/${comment?.id}`).set("authorization", `Bearer ${token}`).expect(200);
  });
});

describe("update comment test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .put(`/posts/1/comments/1`)
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("validate comment input data", async () => {
    const payload: { body?: string } = {};

    const token = await fakeLogin();
    let res = await api.put(`/posts/1/comments/1`).set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入留言內容" }] });

    // 內容長度不夠
    payload.body = "demo";
    res = await api.put(`/posts/1/comments/1`).set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "留言內容最少 10 個字" }] });
  });

  it("update no own comment", async () => {
    const { user, post, comment } = await createPostUserComment();
    const otherUser = await createUser();
    const otherUserToken = await fakeLogin(otherUser?.account);

    const payload = {
      body: Faker.lorem.paragraph(1),
    };

    const token = await fakeLogin(user?.account);

    // 無法更新別人的留言
    await api.put(`/posts/${post?.id}/comments/${comment?.id}`).set("authorization", `Bearer ${otherUserToken}`).send(payload).expect(403);

    // 可以更新自己的評論
    await api.put(`/posts/${post?.id}/comments/${comment?.id}`).set("authorization", `Bearer ${token}`).send(payload).expect(200);
  });
});

describe("create comment test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .post("/posts/1/comments")
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no input data", async () => {
    const token = await createUserAndLogin();
    const post = await createPost({ status: PostStatus.PUBLISH });
    const payload: {
      body?: string;
    } = {};
    let res = await api.post(`/posts/${post?.id}/comments`).set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "請輸入留言內容" }] });

    // 長度不夠
    payload.body = "demo";
    res = await api.post(`/posts/${post?.id}/comments`).set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "留言內容最少 10 個字" }] });
  });

  it("create comment successful", async () => {
    const token = await createUserAndLogin();
    const post = await createPost({ status: PostStatus.PUBLISH });
    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    await api.post(`/posts/${post?.id}/comments`).set("authorization", `Bearer ${token}`).send(payload).expect(200);
  });
});
