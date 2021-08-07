// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { getConnection } from "typeorm";

// entity
import { Post, postSortKeyType, PostStatus } from "entity/post.entity";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";
import { Likeable, LikeableEntityType } from "entity/likeable.entity";

// interface
import { PostSortKeys, PostType } from "graphql/interfaces/post";

// repository
import PostRepository from "repository/post.repository";
import TagRepository from "repository/tag.repository";

@Service()
export default class PostService {
  constructor(
    @InjectRepository()
    private readonly postRepository: PostRepository
  ) {}

  /**
   * 取得所有文章
   * @param param
   * @param {string} param.before
   * @param {string} param.after
   * @param {number} param.first
   * @param {number} param.last
   * @param {PostSortKeys} param.sortKey
   * @param {boolean} param.reverse
   */
  public async findAll({
    before,
    after,
    first,
    last,
    sortKey = PostSortKeys.CREATED_AT,
    reverse = true,
    query = "",
    postType = PostType.POST,
    userId = 0,
    status = PostStatus.PUBLISH,
  }: {
    before: Date;
    after: Date;
    first: number;
    last: number;
    sortKey: PostSortKeys;
    reverse: boolean;
    query: String;
    postType: PostType;
    userId?: number;
    status?: PostStatus;
  }) {
    let builder = getConnection().createQueryBuilder();

    if (first) {
      // 下一頁資料
      if (after) {
        builder = builder
          .from(Post, "posts")
          .select("COUNT(posts.id) OVER()", "count")
          .addSelect("posts.*")
          .where("created_at < :createdAt", { createdAt: after });
      } else {
        builder = builder.from(Post, "posts").select("COUNT(posts.id) OVER()", "count").addSelect("posts.*");
      }
    }

    // 上一頁資料
    if (last) {
      if (before) {
        builder = builder.select(["posts.*", "count"]).from((qb) => {
          return qb
            .select("subPosts.*")
            .addSelect("COUNT(subPosts.id) OVER()", "count")
            .from(Post, "subPosts")
            .orderBy("subPosts.created_at", "ASC")
            .where("subPosts.created_at > :createdAt", { createdAt: before })
            .take(last);
        }, "subPosts");
      } else {
        builder = builder.select(["subPosts.*", "count"]).from((qb) => {
          return qb
            .select("subPosts.*")
            .addSelect("COUNT(subPosts.id) OVER()", "count")
            .from(Post, "subPosts")
            .orderBy("subPosts.created_at", "ASC")
            .take(last);
        }, "subPosts");
      }
    }

    // 取得書籤
    if (postType === PostType.BOOKMARKED) {
      builder = builder.where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("bookmarks.entityId")
          .from(Bookmark, "bookmarks")
          .where("userId = :userId", { userId })
          .andWhere("entityType = :entityType", { entityType: BookmarkEntityType.Post })
          .getQuery();

        return "posts.id IN " + subQuery;
      });
    } else if (postType === PostType.LIKES) {
      builder = builder.where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("likeables.entityId")
          .from(Likeable, "likeables")
          .where("userId = :userId", { userId })
          .andWhere("entityType = :entityType", { entityType: LikeableEntityType.Post })
          .getQuery();

        return "posts.id IN " + subQuery;
      });
    }

    // 關鍵字查詢
    if (query) {
      builder = builder.where("title LIKE :title OR body LIKE :body", { title: `%${query}%`, body: `%${query}%` });
    }

    //  排序方向
    const sort = reverse ? "DESC" : "ASC";

    // sort key 排序處理
    builder = builder.orderBy(postSortKeyType[sortKey], sort);

    return await builder
      .where("status = :status", { status })
      .take(first || last)
      .getRawMany();
  }

  /**
   * 取得文章個數
   * @param param0
   */
  public async findCount({ before, after }: { before: Date; after: Date }) {
    return await this.postRepository.createQueryBuilder("posts").getCount();
  }

  /**
   * 根據編號取得文章
   * @param id 文章編號
   */
  public async findById({ id, status = PostStatus.PUBLISH }: { id: number; status?: PostStatus.PUBLISH }) {
    return await this.postRepository
      .createQueryBuilder("posts")
      .where("id = :id", { id })
      .andWhere("status = :status", { status })
      .getOne();
  }

  /**
   * 取得使用者文章
   * @param {number} userId - 會員編號
   */
  public async findByUsersId({ userId, status = PostStatus.PUBLISH }: { userId: number; status?: PostStatus }) {
    return await this.postRepository
      .createQueryBuilder("posts")
      .where("userId = :userId", { userId })
      .andWhere("status = :status", { status })
      .getMany();
  }
}
