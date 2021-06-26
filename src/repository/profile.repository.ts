import { EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";
import { Profile } from "entity/profile.entity";
import { IProfile } from "interface/profile.interface";

@Service()
@EntityRepository(Profile)
export default class ProfileRepository extends Repository<Profile> {
  /**
   * 創建 profile
   * @param data
   */
  createProfile(data: IProfile) {
    return this.create(data);
  }

  /**
   * 根據編號更新資料
   * @param id  - 編號
   * @param data
   */
  updateById(id: number, data: IProfile) {
    return this.update(
      {
        id,
      },
      {
        ...data,
      }
    );
  }

  /**
   * 根據編號取得資料
   * @param id
   */
  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
