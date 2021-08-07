// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// repository
import BookmarkRepository from "repository/bookmark.repository";

// entity
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";

@Service()
export default class BookmarkService {
  constructor(
    @InjectRepository()
    private readonly bookmarkRepository: BookmarkRepository
  ) {}

  /**
   * 加入書籤
   * @param param
   * @param {number} param.userId 會員編號
   * @param {number} param.postId 文章編號
   */
  public async bookmarkedPost({ userId, postId }: { userId: number; postId: number }) {
    return await this.bookmarkRepository
      .createQueryBuilder("bookmarks")
      .insert()
      .into(Bookmark)
      .values({
        userId,
        entityId: postId,
        entityType: BookmarkEntityType.Post,
      })
      .execute();
  }

  /**
   * 根據文章編號取得書籤資料
   * @param param
   * @param {number} param.userId 會員編號
   * @param {number} param.postId 文章編號
   */
  public async findBookmarkByPostId({ userId, postId }: { userId: number; postId: number }) {
    return await this.bookmarkRepository
      .createQueryBuilder("bookmarks")
      .where("userId = :userId", { userId })
      .andWhere("entityId = :entityId", { entityId: postId })
      .andWhere("entityType = :entityType", { entityType: BookmarkEntityType.Post })
      .getOne();
  }

  /**
   * 取消收藏
   * @param param
   * @param {number} param.userId 會員編號
   * @param {number} param.postId 文章編號
   */
  public async unBookmarkedPost({ userId, postId }: { userId: number; postId: number }) {
    return await this.bookmarkRepository
      .createQueryBuilder("bookmarks")
      .where("userId = :userId", { userId })
      .andWhere("entityId = :entityId", { entityId: postId })
      .andWhere("entityType = :entityType", { entityType: BookmarkEntityType.Post })
      .delete()
      .execute();
  }
}
