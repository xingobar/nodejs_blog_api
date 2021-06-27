import { ProfileGender } from "entity/profile.entity";

import ResourceAbstract from "resource/resource.abstract";
import ProfileResource from "resource/profile.resource";
import { User } from "entity/user.entity";

interface IProfile {
  id: number;
  phone: string;
  gender: ProfileGender;
}

export interface IUserResource {
  id: number;
  account: string;
  email: string;
  profile?: IProfile;
}

export default class UserResource extends ResourceAbstract {
  private user: IUserResource;

  constructor(data: any) {
    super(data);
    this.user = <IUserResource>{
      id: this.resource.id,
      account: this.resource.account,
      email: this.resource.email,
    };
  }

  public async toJson() {
    // 是否加載 profile
    if (this.when("profile")) {
      this.user.profile = new ProfileResource(await this.resource.profile).getFormat();
    }

    return this.user;
  }

  public getFormat() {
    return this.user;
  }
}
