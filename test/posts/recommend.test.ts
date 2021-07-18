import Faker from "faker";
import { api, createUser } from "../global.test";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";
import { getConnection } from "typeorm";
import { assert } from "chai";
import { useRefreshDatabase } from "typeorm-seeding";
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";

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

describe("popularity post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("post not found", (done) => {
    api
      .get("/posts/1/popularity")
      .expect(404)
      .end((err, res) => {
        done();
      });
  });

  it("no popularity post", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });

    const res = await api.get(`/posts/${post?.id}/popularity`).expect(200);

    assert.equal(res.body.length, 0);
  });

  it(" popularity post", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });

    await createPost({ status: PostStatus.PUBLISH });

    const res = await api.get(`/posts/${post?.id}/popularity`).expect(200);

    assert.equal(res.body.length, 1);
  });
});

describe("recommends post test", () => {
  beforeEach(async () => {
    await useRefreshDatabase({ configName: "test.ormconfig.json", connection: "test" });
  });

  it("post not found", (done) => {
    api
      .get("/posts/1/recommends")
      .expect(404)
      .end((err, res) => {
        done();
      });
  });

  it("no post", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });

    const res = await api.get(`/posts/${post?.id}/recommends`).expect(200);

    assert.equal(res.body.length, 0);
  });

  it("no view logs", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });

    await createPost({ status: PostStatus.PUBLISH });

    const res = await api.get(`/posts/${post?.id}/recommends`).expect(200);

    assert.equal(res.body.length, 0);
  });

  it("recommend post", async () => {
    const { user, post } = await createPost({ status: PostStatus.PUBLISH });

    const { user: otherUser, post: otherPost } = await createPost({ status: PostStatus.PUBLISH });

    await getConnection("test")
      .getRepository(ViewLog)
      .createQueryBuilder()
      .insert()
      .into(ViewLog)
      .values({
        userId: otherUser?.id,
        entityId: otherPost?.id,
        entityType: ViewLogEntityType.Post,
      })
      .execute();

    const res = await api.get(`/posts/${post?.id}/recommends`).expect(200);

    assert.equal(res.body.length, 1);
  });
});
