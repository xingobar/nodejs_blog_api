import { Factory, Seeder } from "typeorm-seeding";
import { Post } from "entity/post.entity";

export default class CreatePostSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Post)().create();
  }
}
