import { EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";
import { Profile } from "entity/profile.entity";
import { IProfile } from "interface/profile.interface";
import { RepositoryBase } from "typeorm-linq-repository";

import config from "config/index";

@Service()
@EntityRepository(Profile)
export default class ProfileRepository extends RepositoryBase<Profile> {
  constructor() {
    super(Profile, {
      connectionName: config.connectionName,
    });
  }

  /**
   * 創建 profile
   * @param data
   */
  createProfile(data: IProfile) {
    return this.create(<Profile>{
      ...data,
    });
  }

  /**
   * 根據編號取得資料
   * @param id
   */
  findById(id: number) {
    return this.getOne()
      .where((profile) => profile.id)
      .equal(id);
  }
}
