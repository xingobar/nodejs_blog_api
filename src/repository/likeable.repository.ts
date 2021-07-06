import { Service } from "typedi";
import { RepositoryBase } from "typeorm-linq-repository";
import { EntityRepository } from "typeorm";
import { Likeable } from "entity/likeable.entity";
import { AbstractPolymorphicRepository } from "typeorm-polymorphic";

import config from "config/index";

@Service()
@EntityRepository(Likeable)
export default class LikeableRepository extends AbstractPolymorphicRepository<Likeable> {}
