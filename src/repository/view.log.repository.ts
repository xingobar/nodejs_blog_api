import { EntityRepository } from "typeorm";
import { AbstractPolymorphicRepository } from "typeorm-polymorphic";
import { ViewLog } from "entity/view.log.entity";
import { Service } from "typedi";

@Service()
@EntityRepository(ViewLog)
export default class ViewLogRepository extends AbstractPolymorphicRepository<ViewLog> {}
