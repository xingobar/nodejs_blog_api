import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import PostRepository from "repository/post.repository";

@Service()
export default class PostService {
  constructor(
    @InjectRepository()
    private readonly postRepository: PostRepository
  ) {}

  public async findAll() {
    return await this.postRepository.getAll().orderByDescending((p) => p.createdAt);
  }
}
