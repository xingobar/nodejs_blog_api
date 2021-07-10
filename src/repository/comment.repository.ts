import { RepositoryBase } from "typeorm-linq-repository";
import { Comment } from "entity/comment.entity";
import { EntityRepository } from "typeorm";
import { Service } from "typedi";

import config from "config/index";

@Service()
@EntityRepository()
export default class CommentRepository extends RepositoryBase<Comment> {
  constructor() {
    super(Comment, {
      connectionName: config.connectionName,
    });
  }
}
