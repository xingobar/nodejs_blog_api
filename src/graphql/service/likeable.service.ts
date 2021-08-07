// entity
import { Likeable, LikeableEntityType } from "entity/likeable.entity";

// node_modules
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

// repository
import LikeableRepository from "repository/likeable.repository";

@Service()
export default class LikeableService {
  constructor(
    @InjectRepository()
    private readonly likeableRepository: LikeableRepository
  ) {}

  /**
   * 新增喜歡文章資料
   * @param param0
   */
  public async likePost({ userId, postId }: { userId: number; postId: number }) {
    return await this.likeableRepository
      .createQueryBuilder("likeables")
      .insert()
      .into(Likeable)
      .values({
        userId,
        entityId: postId,
        entityType: LikeableEntityType.Post,
      })
      .execute();
  }

  /**
   * 取得喜歡的文章
   * @param param
   * @param {number} param.userId 會員編號
   * @param {number} param.postId 文章編號
   */
  public async findByPostId({ userId, postId }: { userId: number; postId: number }) {
    return await this.likeableRepository
      .createQueryBuilder("likeables")
      .where("userId = :userId", { userId })
      .andWhere("entityId = :entityId", { entityId: postId })
      .andWhere("entityType = :entityType", { entityType: LikeableEntityType.Post })
      .getOne();
  }

  /**
   * 取消文章按讚
   * @param param0
   */
  public async unlikePost({ userId, postId }: { userId: number; postId: number }) {
    return await this.likeableRepository
      .createQueryBuilder("likeables")
      .where("userId = :userId", { userId })
      .andWhere("entityType = :entityId", { entityId: postId })
      .andWhere("entityType = :entityType", { entityType: LikeableEntityType.Post })
      .delete()
      .execute();
  }
}
