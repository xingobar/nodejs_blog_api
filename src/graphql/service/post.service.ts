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
    let builder = this.postRepository.createQueryBuilder("posts").orderBy("created_at", "DESC");

    if (first) {
      // 下一頁資料
      if (after) {
        builder = builder.where("created_at < :createdAt", { createdAt: after });
      }
    }

    // 上一頁資料
    if (last) {
      builder = builder.where("created_at > :createdAt", { createdAt: before });
    }

    return await builder.take(first || last).getMany();
  }

  /**
   * 取得文章個數
   * @param param0
   */
  public async findCount({ before, after, first, last }: { before: Date; after: Date; first: number; last: number }) {
    let builder = this.postRepository.createQueryBuilder("posts").select("COUNT(*)", "total");

    if (first) {
      // 下一頁資料
      if (after) {
        builder = builder.where("created_at < :createdAt", { createdAt: after });
      }
    }

    // 上一頁資料
    if (last) {
      builder = builder.where("created_at > :createdAt", { createdAt: before });
    }

    const cursorCount = await builder.getRawOne();

    const count = await this.postRepository.createQueryBuilder("posts").getCount();

    return {
      cursorCount,
      count,
    };
  }
}
