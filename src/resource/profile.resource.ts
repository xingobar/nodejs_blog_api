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
    this.profile = <IProfileResource>this.format(this.resource);
  }

  public async toJson(profile: IProfileResource = this.profile): Promise<IProfileResource> {
    return profile;
  }

  public format(item: Profile): IProfileResource {
    return <IProfileResource>{
      id: item.id,
      phone: item.phone,
      gender: item.gender,
    };
  }
}
