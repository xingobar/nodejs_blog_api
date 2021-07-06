import { Service } from "typedi";
import { ICreatePost, IUpdatePost, IGetAllPostParams } from "interface/post.interface";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post, PostStatus } from "entity/post.entity";
import { DeleteResult, InsertResult } from "typeorm";
import { Likeable } from "entity/likeable.entity";

import PostRepository from "repository/post.repository";
import config from "config/index";
import LikeableRepository from "repository/likeable.repository";
@Service({
  transient: true,
})
export default class PostService {
  constructor(
    @InjectRepository(config.connectionName)
    private readonly postRepository: PostRepository,
    @InjectRepository(config.connectionName)
    private readonly likeableRepository: LikeableRepository
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

    const posts = await query.getMany();

    return posts;
  }
}
