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

  public async findPostTag(postId: number[]) {
    const builder = this.taggableRepository
      .createQueryBuilder("taggables")
      .leftJoinAndSelect("taggables.tag", "tag")
      .where("postId IN (:postId)", { postId });

    return await builder.getMany();
  }
}
