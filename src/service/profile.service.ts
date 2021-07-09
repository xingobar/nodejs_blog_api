import { IProfile } from "interface/profile.interface";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Profile } from "entity/profile.entity";
import { User } from "entity/user.entity";
import { UpdateResult } from "typeorm";

import ProfileRepository from "repository/profile.repository";
import UserRepository from "repository/user.repository";
import config from "config/index";

@Service()
export class ProfileService {
  constructor(
    @InjectRepository(config.connectionName)
    private readonly profileRepository: ProfileRepository,
    @InjectRepository(config.connectionName)
    private readonly userRepository: UserRepository
  ) {}

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
    const profile = await this.profileRepository.findById(user.profileId);
    let result;
    if (profile) {
      const updateResult: UpdateResult = await this.profileRepository
        .createQueryBuilder("profiles")
        .update(Profile)
        .set({ ...payload })
        .where("id = :id", { id: user.profileId })
        .execute();

      result = await this.profileRepository.findById(user.profileId);
    } else {
      result = await this.profileRepository.createProfile(payload);

      user.profileId = result.id;

      await this.userRepository.update(user);
    }

    return result;
  }
}
