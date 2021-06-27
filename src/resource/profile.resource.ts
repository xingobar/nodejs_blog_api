import { ProfileGender, Profile } from "entity/profile.entity";

import ResourceAbstract from "resource/resource.abstract";

export interface IProfileResource {
  id: number;
  phone: string;
  gender: ProfileGender;
}

export default class ProfileResource extends ResourceAbstract {
  private profile: IProfileResource;

  constructor(data: Profile) {
    super(data);
    this.profile = (this.format(this.resource) as IProfileResource);
  }

  public async toJson(profile: IProfileResource = this.profile): Promise<IProfileResource> {
    return profile;
  }

  public format(item: Profile): IProfileResource {
    return {
      id: item.id,
      phone: item.phone,
      gender: item.gender,
    } as IProfileResource;
  }
}
