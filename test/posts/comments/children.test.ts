import { assert } from "chai";
import { api, createUser, createUserAndLogin, fakeLogin } from "../../global.test";
import { getConnection } from "typeorm";
import { useRefreshDatabase } from "typeorm-seeding";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";
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

// 新增子留言
export const createChildrenComment = async (parent: Comment | undefined): Promise<Comment | undefined> => {
  await getConnection("test")
    .getRepository(Comment)
    .createQueryBuilder()
    .insert()
    .into(Comment)
    .values({
      postId: parent?.postId,
      userId: parent?.userId,
      body: parent?.body,
      parentId: parent?.id,
    })
    .execute();

  return await getConnection("test")
    .getRepository(Comment)
    .createQueryBuilder()
    .where("postId = :postId", { postId: parent?.postId })
    .where("userId = :userId", { userId: parent?.userId })
    .where("parentId = :parentId", { parentId: parent?.id })
    .getOne();
};

describe("create children comment test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .post("/posts/1/comments/1/children")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no input data", async () => {
    const payload: {
      body?: string;
    } = {};
    const token = await createUserAndLogin();

    let res = await api.post("/posts/1/comments/1/children").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    // 都沒有輸入
    assert.deepEqual(res.body, { errors: [{ message: "請輸入留言內容" }] });

    // 長度不夠
    payload.body = "demo";

    res = await api.post("/posts/1/comments/1/children").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "留言內容最少 10 個字" }] });
  });

  it("not found parent comment", async () => {
    const token = await createUserAndLogin();
    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    await api.post(`/posts/1/comments/1/children`).set("authorization", `Bearer ${token}`).send(payload).expect(404);
  });

  it("create post successful", async () => {
    const { user, post, comment } = await createPostUserComment();
    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    const token = await fakeLogin(user?.account);

    await api.post(`/posts/${post?.id}/comments/${comment?.id}/children`).set("authorization", `Bearer ${token}`).send(payload).expect(200);
  });
});

describe("update children comment test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .put("/posts/1/comments/1/children/1")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("no input data", async () => {
    const payload: {
      body?: string;
    } = {};
    const token = await createUserAndLogin();

    let res = await api.put("/posts/1/comments/1/children/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    // 都沒有輸入
    assert.deepEqual(res.body, { errors: [{ message: "請輸入留言內容" }] });

    // 長度不夠
    payload.body = "demo";

    res = await api.put("/posts/1/comments/1/children/1").set("authorization", `Bearer ${token}`).send(payload).expect(400);

    assert.deepEqual(res.body, { errors: [{ message: "留言內容最少 10 個字" }] });
  });

  it("not found parent comment", async () => {
    const token = await createUserAndLogin();
    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    await api.put("/posts/1/comments/1/children/1").set("authorization", `Bearer ${token}`).send(payload).expect(404);
  });

  it("not found children comment", async () => {
    const { user, post, comment } = await createPostUserComment();
    const token = await fakeLogin(user?.account);

    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    await api
      .put(`/posts/${post?.id}/comments/${comment?.id}/children/1`)
      .set("authorization", `Bearer ${token}`)
      .send(payload)
      .expect(404);
  });

  it("update not own children comment", async () => {
    const { user, post, comment } = await createPostUserComment();
    const token = await fakeLogin(user?.account);
    const children = await createChildrenComment(comment);

    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    const otherUserToken = await createUserAndLogin();

    await api
      .put(`/posts/${post?.id}/comments/${comment?.id}/children/${children?.id}`)
      .set("authorization", `Bearer ${otherUserToken}`)
      .send(payload)
      .expect(403);
  });

  it("update children comment successful", async () => {
    const { user, post, comment } = await createPostUserComment();
    const token = await fakeLogin(user?.account);
    const children = await createChildrenComment(comment);

    const payload: {
      body?: string;
    } = {
      body: Faker.lorem.paragraph(1),
    };

    await api
      .put(`/posts/${post?.id}/comments/${comment?.id}/children/${children?.id}`)
      .set("authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200);
  });
});

describe("delete post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("no login", (done) => {
    api
      .delete("/posts/1/comments/1/children/1")
      .expect(401)
      .end((err, res) => {
        assert.deepEqual(res.body, { message: "尚未登入" });
        done();
      });
  });

  it("not found parent comment", async () => {
    const token = await createUserAndLogin();

    await api.delete("/posts/1/comments/1/children/1").set("authorization", `Bearer ${token}`).expect(404);
  });

  it("not found children comment", async () => {
    const { user, post, comment } = await createPostUserComment();
    const token = await fakeLogin(user?.account);
    await api.delete(`/posts/${post?.id}/comments/${comment?.id}/children/1`).set("authorization", `Bearer ${token}`).expect(404);
  });

  it("no delete other children comment", async () => {
    const { user, post, comment } = await createPostUserComment();
    const children = await createChildrenComment(comment);

    const otherUserToken = await createUserAndLogin();

    await api
      .delete(`/posts/${post?.id}/comments/${comment?.id}/children/${children?.id}`)
      .set("authorization", `Bearer ${otherUserToken}`)
      .expect(403);
  });

  it("delete own children comment successful", async () => {
    const { user, post, comment } = await createPostUserComment();
    const children = await createChildrenComment(comment);

    const token = await fakeLogin(user?.account);

    await api
      .delete(`/posts/${post?.id}/comments/${comment?.id}/children/${children?.id}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });
});
