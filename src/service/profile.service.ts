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
    const result: UpdateResult = await this.profileRepository.update(
      {
        id: user.profileId,
      },
      {
        ...data,
      }
    );

    const profile: Profile | undefined = await this.profileRepository.findById(user.profileId);

    return profile;
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
    if (await this.profileRepository.findById(user.profileId)) {
      await this.profileRepository.update(
        {
          id: user.profileId,
        },
        {
          ...payload,
        }
      );
    } else {
      const newProfile: Profile = await this.profileRepository.save(payload);

      user.profile = newProfile;

      await this.userRepository.update(user);
    }

    const profile: Profile | undefined = await this.profileRepository.findById(user.profileId);

    return profile;
  }
}
