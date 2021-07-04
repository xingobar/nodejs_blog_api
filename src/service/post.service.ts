import { Service } from "typedi";
import { ICreatePost, IUpdatePost } from "interface/post.interface";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "entity/post.entity";

import PostRepository from "repository/post.repository";
import config from "config/index";
import { DeleteResult } from "typeorm";

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
    return this.postRepository.createQueryBuilder("posts").softDelete().from(Post).where("id = :id", { id: id }).execute();
  }
}
