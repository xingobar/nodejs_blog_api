import { EntityRepository } from "typeorm";
import { Service } from "typedi";
import { Taggable } from "entity/taggable.entity";
import { AbstractPolymorphicRepository } from "typeorm-polymorphic";

@Service()
@EntityRepository(Taggable)
export default class TaggableRepository extends AbstractPolymorphicRepository<Taggable> {}
