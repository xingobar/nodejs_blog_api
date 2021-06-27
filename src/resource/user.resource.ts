import { User } from "entity/user.entity";
import { IProfile } from "resource/profile.resource";

import ResourceAbstract from "resource/resource.abstract";
import ProfileResource from "resource/profile.resource";

// 單筆資料
export interface IUserResource {
  id: number;
  account: string;
  email: string;
  profile?: IProfile;
}

// 分頁資料
export interface IUserResourcePaginate {
  data: IUserResource[];
}

export default class UserResource extends ResourceAbstract {
  private user: IUserResource;
  private users: IUserResourcePaginate = {
    data: [],
  };

  constructor(data: any) {
    super(data);
    if (Array.isArray(data)) {
      this.users.data = data.map<IUserResource>((item) => {
        return this.format(item);
      });
    } else {
      this.user = <IUserResource>this.format(this.resource);
    }
  }

  public async toJson(user: IUserResource = this.user): Promise<IUserResource> {
    // 是否加載 profile
    if (this.when("profile")) {
      user.profile = new ProfileResource(await this.getResourceByIndex().profile).getFormat();
    }

    return user;
  }

  public async toArray(): Promise<IUserResourcePaginate> {
    this.users.data.forEach(async (user: IUserResource, key: number) => {
      this.setIndex(key);
      this.users.data[key] = await this.toJson(user);
    });
    return this.users;
  }

  public getFormat() {
    return this.user;
  }

  public format(item: User): IUserResource {
    return {
      id: item.id,
      account: item.account,
      email: item.email,
    };
  }
}
