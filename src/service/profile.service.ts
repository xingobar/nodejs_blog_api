import { IProfile } from "interface/profile.interface";
import ProfileRepository from "repository/profile.repository";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Profile } from "entity/profile.entity";
import { User } from "entity/user.entity";
import { UpdateResult } from "typeorm";

@Service()
export class ProfileService {
  constructor(
    @InjectRepository()
    private readonly profileRepository: ProfileRepository
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
}
