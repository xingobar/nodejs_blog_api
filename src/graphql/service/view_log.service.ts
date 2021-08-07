// service
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// entity
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";

// repository
import ViewLogRepository from "repository/view.log.repository";

@Service()
export default class ViewLogService {
  constructor(
    @InjectRepository()
    private readonly viewLogRepository: ViewLogRepository
  ) {}

  /**
   * 取得使用者某個文章的閱讀紀錄
   * @param param
   * @param {}
   */
  public async findPostLogsByUserId({ userId, postId }: { userId: number; postId: number }) {
    return await this.viewLogRepository
      .createQueryBuilder("view_logs")
      .where("userId = :userId", { userId })
      .andWhere("entityId = :entityId", { entityId: postId })
      .andWhere("entityType = :entityType", { entityType: ViewLogEntityType.Post })
      .getOne();
  }

  /**
   * 新增文章觀看紀錄
   * @param {object} param
   * @param {number} param.userId 會員編號
   * @param {number} param.postId 文章編號
   */
  public async createPostLogs({ userId, postId }: { userId: number; postId: number }) {
    return await this.viewLogRepository
      .createQueryBuilder("view_logs")
      .insert()
      .into(ViewLog)
      .values({
        userId,
        entityId: postId,
        entityType: ViewLogEntityType.Post,
      })
      .execute();
  }
}
