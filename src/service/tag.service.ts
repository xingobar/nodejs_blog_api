import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import TagRepository from "repository/tag.repository";

@Service()
export default class TagService {
  constructor(
    @InjectRepository()
    private readonly tagRepository: TagRepository
  ) {}

  /**
   * 根據編號取得標籤
   * @param ids
   */
  public findByIds(ids: number[]) {
    return this.tagRepository
      .getAll()
      .where((t) => t.id)
      .in(ids);
  }
}
