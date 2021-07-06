import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { LikeAble, LikeableEntityType } from "entity/likeable.entity";
import { Post } from "entity/post.entity";
import { DeleteResult, InsertResult } from "typeorm";
import LikeableRepository from "repository/likeable.repository";

@Service({
  transient: true,
})
export default class LikeableService {
  constructor(
    @InjectRepository()
    private readonly likeableRepository: LikeableRepository
  ) {}

  /**
   * 根據編號取得 like 的資料
   * @param param
   * @param {number} userId 會員編號
   * @param {LikeableEntityType} entityType entity type
   * @param {number} entityId entity id
   */
  public async findById({
    userId,
    entityType,
    entityId,
  }: {
    userId: number;
    entityType: string;
    entityId: number;
  }): Promise<LikeAble | undefined> {
    return await this.likeableRepository.findOne({
      where: {
        userId,
        entityType,
        entityId,
      },
    });
  }

  /**
   * 根據編號刪除喜歡資料
   * @param {object} params
   * @param {number} params.userId 會員編號
   * @param {string} params.entity entity
   * @param {string} params.entityType entity type
   */
  public async deleteById({ userId, entity, entityType }: { userId: number; entity: Post; entityType: string }): Promise<DeleteResult> {
    return await this.likeableRepository.delete({
      userId,
      entityType,
      entityId: entity.id,
    });
  }

  /**
   * 喜歡文章
   * @param {object} param
   * @param {number} param.userId 會員編號
   * @param {Post} param.post - 文章
   */
  public async likePost({ userId, post }: { userId: number; post: Post }): Promise<LikeAble> {
    let likeable: LikeAble = new LikeAble();

    likeable.userId = userId;
    likeable.post = post;

    return await this.likeableRepository.save(likeable);
  }
}
