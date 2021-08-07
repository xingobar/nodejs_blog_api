// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// repository
import TaggableRepository from "repository/taggable.repository";

@Service()
export default class TagService {
  constructor(
    @InjectRepository()
    private readonly taggableRepository: TaggableRepository
  ) {}

  /**
   * 根據文章編號取得標籤
   * @param {number[]} postsId 文章編號
   */
  public async findTagByPostIds(postsId: number[]) {
    const builder = this.taggableRepository
      .createQueryBuilder("taggables")
      .leftJoinAndSelect("taggables.tag", "tag")
      .where("postId IN (:postsId)", { postsId });

    return await builder.getMany();
  }
}
