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
  constructor(data: any) {
    super(data);
  }

  public async toJson(user: any = this.resource): Promise<IUserResource> {
    const data = <IUserResource>this.format(user);

    // 是否加載 profile
    if (this.when("profile")) {
      data.profile = await new ProfileResource(await this.getCurrentResource().profile).toJson();
    }

    return data;
  }

  public async toArray(): Promise<any> {
    return await super.toArray();
  }

  public format(item: User): IUserResource {
    return {
      id: item.id,
      account: item.account,
      email: item.email,
    };
  }
}
