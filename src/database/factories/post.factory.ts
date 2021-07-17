import Faker from "faker";
import { define, factory } from "typeorm-seeding";
import { Post, PostStatus } from "entity/post.entity";
import { User } from "entity/user.entity";

define(Post, (faker: typeof Faker) => {
  const post = new Post();

  post.title = faker.lorem.word(10);
  post.body = faker.lorem.word(10);
  post.user = factory(User)() as any;
  post.status = PostStatus.PUBLISH;
  post.image = faker.image.imageUrl();

  return post;
});
