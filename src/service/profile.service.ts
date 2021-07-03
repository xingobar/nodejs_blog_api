import { IProfile } from "interface/profile.interface";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Profile } from "entity/profile.entity";
import { User } from "entity/user.entity";
import { UpdateResult } from "typeorm";

import ProfileRepository from "repository/profile.repository";
import UserRepository from "repository/user.repository";
import config from "config/index";

@Service({
  transient: true,
})
export class ProfileService {
  constructor(
    @InjectRepository(config.connectionName)
    private readonly profileRepository: ProfileRepository,
    @InjectRepository(config.connectionName)
    private readonly userRepository: UserRepository
  ) {}

  /**
   * 更新資料後回傳
   * @param user
   * @param data
   */
  public async update(user: User, data: IProfile): Promise<Profile | undefined> {
    let profile: Profile | undefined = await this.profileRepository.findById(user.profileId);

    profile.gender = data.gender;
    profile.phone = data.phone;

    const result = await this.profileRepository.update(profile);

    return result;
  }

  /**
   * 根據編號取得個人資料
   * @param profileId
   */
  public async findById(profileId: number): Promise<Profile | undefined> {
    return await this.profileRepository.findById(profileId);
  }

  /**
   * 個人資料 update or create
   * @param user
   * @param payload
   */
  public async updateOrCreate(user: User, payload: IProfile): Promise<Profile | undefined> {
    let profile = await this.profileRepository.findById(user.profileId);
    let result;
    if (profile) {
      profile.gender = payload.gender;
      profile.phone = payload.phone;
      result = await this.profileRepository.update(profile);
    } else {
      const result: Profile = await this.profileRepository.createProfile(payload);

      user.profile = result;

      await this.userRepository.update(user);
    }

    return result;
  }
}
