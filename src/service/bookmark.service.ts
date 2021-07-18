import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";
import { Post } from "entity/post.entity";
import BookmarkRepository from "repository/bookmark.repository";
import PostRepository from "repository/post.repository";

@Service()
export default class BookmarkService {
  constructor(
    @InjectRepository()
    private readonly bookmarkRepository: BookmarkRepository,
    @InjectRepository()
    private readonly postRepository: PostRepository
  ) {}

  /**
   * 取得特定的收藏資料
   * @param param0
   * @param {number} params.userId 會員編號
   * @param {number} params.entityId
   * @param {string} params.entityType
   */
  public async findByUserIdAndEntity({
    userId,
    entityId,
    entityType,
  }: {
    userId: number;
    entityId: number;
    entityType: BookmarkEntityType;
  }): Promise<Bookmark | undefined> {
    return await this.bookmarkRepository.findOne({
      where: {
        userId,
        entityId,
        entityType,
      },
    });
  }

  /**
   * 收藏文章
   * @param param
   * @param {number} params.userId
   * @param {Post} params.entity
   */
  public async bookmarkedPost({ userId, entity }: { userId: number; entity: Post }): Promise<Bookmark> {
    const bookmark = new Bookmark();
    bookmark.userId = userId;
    bookmark.post = entity;

    return await this.bookmarkRepository.save(bookmark);
  }

  /**
   * 取消收藏
   * @param {Bookmark} entity
   */
  public async unBookmarkedPost(entity: Bookmark): Promise<Bookmark> {
    return await this.bookmarkRepository.remove(entity);
  }

  /**
   * 取得使用者藏的文章
   * @param userId
   * @param entityId
   * @param entityType
   */
  public findPaginatorByUserId(
    userId: number,
    entityType: BookmarkEntityType,
    { page = 1, limit = 10 }: { page?: number; limit?: number }
  ) {
    return this.postRepository
      .createQueryBuilder("posts")
      .where((qb) => {
        const subquery = qb
          .subQuery()
          .from(Bookmark, "bookmarks")
          .select("bookmarks.entityId")
          .where("userId = :userId", { userId })
          .andWhere("entityType = :entityType", { entityType })
          .getQuery();
        return "posts.id IN " + subquery;
      })
      .leftJoinAndSelect("posts.user", "owner")
      .take(page * limit)
      .skip((page - 1) * limit)
      .getMany();
  }

  /**
   * 取得使用收藏文章的總數
   * @param userId
   * @param entityType
   */
  public findTotalByUserId(userId: number, entityType: BookmarkEntityType) {
    return this.bookmarkRepository.count({
      where: {
        userId,
        entityType,
      },
    });
  }
}
