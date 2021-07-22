import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Tag } from "entity/tag.entity";

import TagRepository from "repository/tag.repository";

@Service()
export default class TagService {
  constructor(
    @InjectRepository()
    private readonly tagRepository: TagRepository
  ) {}

  /**
   * 新增標籤
   * @param {string} title - 標籤名稱
   */
  public async createTag(title: string) {
    return await this.tagRepository.create({
      title,
    } as Tag);
  }
}