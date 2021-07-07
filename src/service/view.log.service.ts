import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";
import { Post } from "entity/post.entity";

import ViewLogRepository from "repository/view.log.repository";

@Service()
export default class ViewLogService {
  constructor(
    @InjectRepository()
    private readonly viewLogRepository: ViewLogRepository
  ) {}

  public async findById({
    userId,
    entityType,
    entityId,
  }: {
    userId: number;
    entityType: ViewLogEntityType;
    entityId: number;
  }): Promise<ViewLog | undefined> {
    return await this.viewLogRepository.findOne({
      where: {
        userId,
        entityType,
        entityId,
      },
    });
  }

  public async createLog({ userId, entity }: { userId: number; entity: Post }): Promise<ViewLog> {
    const viewLog = new ViewLog();

    viewLog.userId = userId;
    viewLog.post = entity;

    return await this.viewLogRepository.save(viewLog);
  }
}
