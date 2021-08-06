import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "entity/post.entity";
import { PostSortKeys } from "graphql/interfaces/post";

import PostRepository from "repository/post.repository";
import { sortBy } from "lodash";

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
    sortKey,
    reverse = true,
    query = "",
  }: {
    before: Date;
    after: Date;
    first: number;
    last: number;
    sortKey: PostSortKeys;
    reverse: boolean;
    query: String;
  }) {
    let builder = this.postRepository.createQueryBuilder("posts");

    if (first) {
      // 下一頁資料
      if (after) {
        builder = builder
          .select("COUNT(posts.id) OVER()", "count")
          .addSelect("posts.*")
          .where("created_at < :createdAt", { createdAt: after });
      } else {
        builder = builder.select("COUNT(posts.id) OVER()", "count").addSelect("posts.*");
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
        builder = builder.select(["posts.*", "count"]).from((qb) => {
          return qb
            .select("subPosts.*")
            .addSelect("COUNT(subPosts.id) OVER()", "count")
            .from(Post, "subPosts")
            .orderBy("subPosts.created_at", "ASC");
        }, "subPosts");
      }
    }

    // 關鍵字查詢
    if (query) {
      builder = builder.where("title LIKE :title OR body LIKE :body", { title: `%${query}%`, body: `%${query}%` });
    }

    //  排序方向
    const sort = reverse ? "DESC" : "ASC";

    // sort key 排序處理
    switch (sortKey) {
      case PostSortKeys.CREATED_AT:
        builder.orderBy("created_at", sort);
        break;
      case PostSortKeys.ID:
        builder.orderBy("id", sort);
        break;
      case PostSortKeys.TITLE:
        builder.orderBy("title", sort);
        break;
      case PostSortKeys.UPDATED_AT:
        builder.orderBy("updated_at", sort);
        break;
      default:
        builder.orderBy("created_at", sort);
    }

    return await builder.take(first || last).getRawMany();
  }

  /**
   * 取得文章個數
   * @param param0
   */
  public async findCount({ before, after }: { before: Date; after: Date }) {
    return await this.postRepository.createQueryBuilder("posts").getCount();
  }
}
