// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// repository
import TaggableRepository from "repository/taggable.repository";
import TagRepository from "repository/tag.repository";

@Service()
export default class TagService {
  constructor(
    @InjectRepository()
    private readonly taggableRepository: TaggableRepository,
    @InjectRepository()
    private readonly tagRepository: TagRepository
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

  /**
   * 根據編號取得標籤
   * @param {number[]} ids 標籤編號
   */
  public async findByIds(ids: number[]) {
    return await this.tagRepository.createQueryBuilder("tags").whereInIds(ids).getMany();
  }

  /**
   * 取得所有標籤
   */
  public async findTags() {
    return await this.tagRepository.createQueryBuilder("tags").orderBy("id", "DESC").getMany();
  }
}
