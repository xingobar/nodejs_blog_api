import { Service } from "typedi";
import { ICreatePost, IUpdatePost, IGetAllPostParams } from "interface/post.interface";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post, PostStatus } from "entity/post.entity";
import { DeleteResult } from "typeorm";
import { ViewLog } from "entity/view.log.entity";

import PostRepository from "repository/post.repository";
import config from "config/index";
import { User } from "entity/user.entity";
@Service({
  transient: true,
})
export default class PostService {
  constructor(
    @InjectRepository(config.connectionName)
    private readonly postRepository: PostRepository
  ) {}

  /**
   * 新增文章
   * @param {ICreatePost} payload
   */
  public async createPost(payload: ICreatePost) {
    return await this.postRepository.create({
      ...payload,
    } as Post);
  }

  /**
   * 根據編號取得文章
   * @param {number} id - 文章編號
   */
  public findById(id: number) {
    return this.postRepository
      .getOne()
      .where((post) => post.id)
      .equal(id);
  }

  /**
   * 根據編號更新文章
   * @param {number} id - 文章編號
   * @param {IUpdatePost} data
   */
  public async updateById(id: number, data: IUpdatePost): Promise<Post> {
    await this.postRepository
      .createQueryBuilder("posts")
      .update(Post)
      .set({
        ...data,
      })
      .where("id = :id", { id })
      .execute();

    return await this.postRepository
      .getOne()
      .where((post) => post.id)
      .equal(id);
  }

  /**
   * 根據編號刪除文章
   * @param post
   */
  public async deleteById(id: number): Promise<DeleteResult> {
    return this.postRepository.createQueryBuilder("posts").softDelete().from(Post).where("id = :id", { id }).execute();
  }

  /**
   * 取得多篇文章資訊
   *
   * 抓取發布的文章
   * 且會按照傳進來的參數排序
   * created_at, feedback_count, view_count, like_count
   * 且排除自己的文章
   * 搜尋作者名稱等
   *
   * @param params
   */
  public async findAllByFilter(params: IGetAllPostParams, excludeUser: number = 0): Promise<Post[]> {
    // 抓取發布的文章
    let query = this.postRepository
      .createQueryBuilder("posts")
      .innerJoinAndSelect("posts.user", "users", "users.id")
      .where(`posts.status = :status`, { status: PostStatus.PUBLISH });

    // 文章排序
    switch (params.orderBy?.sort) {
      case "ASC":
      case "DESC":
        query = query.orderBy(`posts.${params.orderBy.column}`, params?.orderBy?.sort);
        break;
      default:
        query = query.orderBy(`posts.created_at`, "DESC");
        break;
    }

    // 排除自己
    if (excludeUser > 0) {
      query = query.where("posts.userId != :userId ", { userId: excludeUser });
    }

    /**
     * 關鍵字
     * 搜尋標題以及內文是否有關鍵字
     */
    if (params.keyword) {
      query = query
        .where("title like :title", { title: `%${params.keyword}%` })
        .orWhere("body like :body", { body: `%${params.keyword}%` });
    }

    /**
     * 搜尋作者
     */
    if (params.account) {
      query = query.where((qb) => {
        const subquery = qb
          .subQuery()
          .select("users.id")
          .from(User, "users")
          .where("account like :account ", { account: `%${params.account}%` })
          .getQuery();
        return "posts.userId IN " + subquery;
      });
    }

    const posts = await query.getMany();

    return posts;
  }

  /**
   * 推薦最多人觀看的 4 篇文章
   * @param {number} postId - 文章編號
   */
  public async getPopularity(postId: number, limit: number = 4) {
    return await this.postRepository
      .getAll()
      .where((p) => p.id)
      .notEqual(postId)
      .orderByDescending((p) => p.viewCount)
      .take(limit);
  }

  /**
   * 取得其他人也觀看的熱門文章
   *
   * 排除目前的文章,
   * 取得其他人也觀看的熱門文章
   *
   * @param {number} postId - 文章編號
   * @param {number} userId - 會員編號
   * @param {number} limit - 取得多少筆資料
   */
  public async getOtherPopularityRead(postId: number, userId: number, limit: number = 4) {
    return await this.postRepository
      .createQueryBuilder("posts")
      .select("posts.*")
      .innerJoin(
        (subquery) => {
          return subquery
            .from((subquery) => {
              return subquery.from(ViewLog, "view_logs").where("entityId != :entityId", { entityId: postId });
            }, "tmp")
            .select("tmp.entityId")
            .addSelect("COUNT(*)", "total")
            .where("userId != :userId", { userId })
            .groupBy("tmp.entityId")
            .orderBy("total", "DESC")
            .take(limit);
        },
        "popularity",
        "popularity.entityId = posts.id"
      )
      .getRawMany();
  }
}
