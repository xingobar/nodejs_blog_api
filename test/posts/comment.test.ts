import { createUser, api } from "../global.test";
import { assert } from "chai";
import { useRefreshDatabase } from "typeorm-seeding";

import { User } from "entity/user.entity";
import { Post, PostStatus } from "entity/post.entity";
import { getConnection } from "typeorm";
import { Comment } from "entity/comment.entity";

import Faker from "faker";

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
