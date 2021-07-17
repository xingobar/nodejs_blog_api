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
