import { EntityRepository } from "typeorm";
import { AbstractPolymorphicRepository } from "typeorm-polymorphic";
import { Bookmark } from "entity/bookmark.entity";
import { Service } from "typedi";

@Service()
@EntityRepository(Bookmark)
export default class BookmarkRepository extends AbstractPolymorphicRepository<Bookmark> {}
