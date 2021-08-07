// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// entity
import { Tag } from "entity/tag.entity";
import { Taggable, TaggableEntityType } from "entity/taggable.entity";

// repository
import TagRepository from "repository/tag.repository";
import PostRepository from "repository/post.repository";

@Service()
export default class TagService {
  constructor(
    @InjectRepository()
    private readonly tagRepository: TagRepository,
    @InjectRepository()
    private readonly postRepository: PostRepository
  ) {}

  public async findPostTag(postId: number) {
    const builder = this.tagRepository.createQueryBuilder("tags").where((qb) => {
      const subQuery = qb
        .subQuery()
        .select("taggables.entityId")
        .from(Taggable, "taggables")
        .where("taggables.postId = :postId", { postId })
        .andWhere("taggables.entityType = :entityType", { entityType: TaggableEntityType.Tag })
        .getQuery();

      return "tags.id IN " + subQuery;
    });

    // query = this.postRepository.createQueryBuilder('posts')

    return await builder.getMany();
  }
}
