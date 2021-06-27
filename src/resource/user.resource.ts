import { ProfileGender, Profile } from "entity/profile.entity";

interface IProfile {
  id: number;
  phone: string;
  gender: ProfileGender;
}

interface IUserResource {
  id: number;
  account: string;
  email: string;
  profile?: IProfile;
}

export default class UserResource {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  public async toJson() {
    const user: IUserResource = {
      id: this.data.id,
      account: this.data.account,
      email: this.data.email,
    };

    if (this.data.profile && this.data.profile.then && typeof this.data.profile.then === "function") {
      const profile = await this.data.profile;
      if (profile) {
        user.profile = <IProfile>{
          id: profile.id,
          gender: profile.gender,
          phone: profile.gender,
        };
      }
    }

    return user;
  }
}
