import { ProfileGender, Profile } from "entity/profile.entity";

import ResourceAbstract from "resource/resource.abstract";

export interface IProfile {
  id: number;
  phone: string;
  gender: ProfileGender;
}

export default class ProfileResource extends ResourceAbstract {
  private profile: IProfile;

  constructor(data: Profile) {
    super(data);
    this.profile = <IProfile>this.format(this.resource);
  }

  public getFormat() {
    return this.profile;
  }

  public format(item: Profile): IProfile {
    return <IProfile>{
      id: item.id,
      phone: item.phone,
      gender: item.gender,
    };
  }
}
