import { Service } from "typedi";
import { ICreatePost } from "interface/post.interface";
import { InjectRepository } from "typeorm-typedi-extensions";
import PostRepository from "repository/post.repository";
import { Post } from "entity/post.entity";
import config from "config/index";

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
    return await this.postRepository.create(<Post>{
      ...payload,
    });
  }
}
