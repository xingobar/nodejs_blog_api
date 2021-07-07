import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";
import { Post } from "entity/post.entity";
import BookmarkRepository from "repository/bookmark.repository";

@Service()
export default class BookmarkService {
  constructor(
    @InjectRepository()
    private readonly bookmarkRepository: BookmarkRepository
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
}
