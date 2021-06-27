import { ProfileGender } from "entity/profile.entity";

import ResourceAbstract from "resource/resource.abstract";

export interface IProfile {
  id: number;
  phone: string;
  gender: ProfileGender;
}

export default class ProfileResource extends ResourceAbstract {
  private profile: IProfile;

  constructor(data: any) {
    super(data);
    this.profile = <IProfile>{
      id: this.resource.id,
      phone: this.resource.phone,
      gender: this.resource.gender,
    };
  }

  public getFormat() {
    return this.profile;
  }
}
