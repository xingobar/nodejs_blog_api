import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "entity/post.entity";
import PostRepository from "repository/post.repository";

@Service()
export default class PostService {
  constructor(
    @InjectRepository()
    private readonly postRepository: PostRepository
  ) {}

  /**
   * 取得所有文章
   * @param {object} param
   * @param {string} param.cursor cursor
   * @param {number} param.limit 每頁幾筆資料
   */
  public async findAll({ before, after, first, last }: { before: Date; after: Date; first: number; last: number }) {
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

    return await builder
      .take(first || last)
      .orderBy("posts.created_at", "DESC")
      .getRawMany();
  }

  /**
   * 取得文章個數
   * @param param0
   */
  public async findCount({ before, after }: { before: Date; after: Date }) {
    return await this.postRepository.createQueryBuilder("posts").getCount();
  }
}
