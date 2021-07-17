import { expect, assert } from "chai";
import { getConnection } from "typeorm";
import { api, createUser } from "./global.test";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";
import { factory } from "typeorm-seeding";

let post: Post | undefined;

export const createPost = async ({ status = PostStatus.PUBLISH }: { status: PostStatus }) => {
  const user = await createUser();
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
};

describe("get post index ", () => {
  // beforeEach((done) => {
  //   getConnection("test").getRepository(Post).createQueryBuilder().delete().execute();
  //   getConnection("test").getRepository(User).createQueryBuilder().delete().execute();
  //   done();
  // });

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
