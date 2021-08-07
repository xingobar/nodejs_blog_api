// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// entity
import { Profile, ProfileGender } from "entity/profile.entity";
import { User } from "entity/user.entity";

// repository
import ProfileRepository from "repository/profile.repository";
import UserRepository from "repository/user.repository";

@Service()
export default class ProfileService {
  constructor(
    @InjectRepository()
    private readonly profileRepository: ProfileRepository,
    @InjectRepository()
    private readonly userRepository: UserRepository
  ) {}

  /**
   * 新增 or 更新個人資料
   * @param param
   * @param {string} param.phone 個人資料
   * @param {ProfileGender} param.gender 性別
   * @param {number} param.profileId 個人資料編號
   */
  public async store({ phone, gender, profileId, userId }: { phone: string; gender: ProfileGender; profileId: number; userId: number }) {
    if (!profileId) {
      const { generatedMaps } = await this.profileRepository
        .createQueryBuilder("profiles")
        .insert()
        .into(Profile)
        .values({
          phone,
          gender,
        })
        .execute();
      profileId = generatedMaps[0].id;
    } else {
      const { generatedMaps } = await this.profileRepository
        .createQueryBuilder("profiles")
        .where("id = :id", { id: profileId })
        .update(Profile)
        .set({
          phone,
          gender,
        })
        .execute();

      profileId = generatedMaps[0].id;
    }

    // 更新使用者 profileId
    await this.userRepository
      .createQueryBuilder("users")
      .where("id = :id", { id: userId })
      .update(User)
      .set({
        profileId,
      })
      .execute();

    return await this.profileRepository.createQueryBuilder("profiles").where("id = :id", { id: profileId }).getOne();
  }

  /**
   * 根據編號取得個人資料
   *
   * @param profileId 個人資料編號
   */
  public async findById(profileId: number) {
    return await this.profileRepository.createQueryBuilder("profiles").where("id = :id", { id: profileId }).getOne();
  }
}
