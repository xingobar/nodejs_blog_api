import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
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
  public async findAll({ cursor, limit = 10 }: { cursor: Date; limit: number }) {
    const builder = this.postRepository.createQueryBuilder("posts").orderBy("created_at", "DESC");

    if (cursor) {
      builder.where("created_at < :createdAt", { createdAt: cursor });
    }

    return await builder.take(limit).getMany();
  }
}
