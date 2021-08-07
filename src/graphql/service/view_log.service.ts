// service
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { getConnection } from "typeorm";

// entity
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";
import { Post, PostStatus } from "entity/post.entity";

// repository
import ViewLogRepository from "repository/view.log.repository";
import PostRepository from "repository/post.repository";

@Service()
export default class ViewLogService {
  constructor(
    @InjectRepository()
    private readonly viewLogRepository: ViewLogRepository,
    @InjectRepository()
    private readonly postRepository: PostRepository
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

  /**
   * 取得有觀看同樣文章的使用者
   * @param {object} param
   * @param {number} param.postId 文章編號
   * @param {number} param.userId 會員編號
   */
  public async findSameReadPostIdUser({ postId, userId }: { postId: number; userId: number }) {
    return await this.viewLogRepository
      .createQueryBuilder("view_logs")
      .where("userId != :userId", { userId })
      .andWhere("entityId = :entityId", { entityId: postId })
      .andWhere("entityType = :entityType", { entityType: ViewLogEntityType.Post })
      .groupBy("userId")
      .take(10)
      .getMany();
  }

  /**
   * 取得推薦的文章
   * @param param0
   */
  public async recommendPost({ postId, usersId, limit = 4 }: { postId: number; usersId: number[]; limit?: number }) {
    return await this.postRepository
      .createQueryBuilder("posts")
      .innerJoinAndSelect(
        (qb) => {
          return qb
            .from(ViewLog, "view_logs")
            .where("view_logs.userId IN (:usersId)", { usersId })
            .andWhere("view_logs.entityId != :entityId", { entityId: postId })
            .andWhere("view_logs.entityType = :entityType", { entityType: ViewLogEntityType.Post })
            .orderBy("view_logs.createdAt", "DESC")
            .take(limit);
        },
        "viewLogs",
        "posts.id = viewLogs.entityId"
      )
      .take(limit)
      .getMany();
  }
}
