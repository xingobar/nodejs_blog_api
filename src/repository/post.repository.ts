import { Post } from "entity/post.entity";
import { RepositoryBase } from "typeorm-linq-repository";
import { EntityRepository } from "typeorm";
import { Service } from "typedi";

@Service()
@EntityRepository()
export default class PostRepository extends RepositoryBase<Post> {
  constructor() {
    super(Post);
  }
}
