import { EntityRepository } from "typeorm";
import { Service } from "typedi";
import { RepositoryBase } from "typeorm-linq-repository";
import { Tag } from "entity/tag.entity";

import config from "config/index";

@Service()
@EntityRepository()
export default class TagRepository extends RepositoryBase<Tag> {
  constructor() {
    super(Tag, {
      connectionName: config.connectionName,
    });
  }
}
