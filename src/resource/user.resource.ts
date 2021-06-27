import { User } from "entity/user.entity";
import { IProfileResource } from "resource/profile.resource";

import ResourceAbstract from "resource/resource.abstract";
import ProfileResource from "resource/profile.resource";

// 單筆資料
export interface IUserResource {
  id: number;
  account: string;
  email: string;
  profile?: IProfileResource;
}

export default class UserResource extends ResourceAbstract {
  private user: IUserResource;
  private users: IUserResource[];

  constructor(data: any) {
    super(data);
    if (Array.isArray(data)) {
      this.users = data.map<IUserResource>((item) => {
        return this.format(item);
      });
    } else {
      this.user = this.format(this.resource) as IUserResource;
    }
  }

  public async toJson(user: IUserResource = this.user): Promise<IUserResource> {
    // 是否加載 profile
    if (this.when("profile")) {
      user.profile = await new ProfileResource(await this.getResourceByIndex().profile).toJson();
    }

    return user;
  }

  public async toArray(): Promise<IUserResource[]> {
    this.users.forEach(async (user: IUserResource, key: number) => {
      this.setIndex(key);
      this.users[key] = await this.toJson(user);
    });
    return this.users;
  }

  public format(item: User): IUserResource {
    return {
      id: item.id,
      account: item.account,
      email: item.email,
    };
  }
}
