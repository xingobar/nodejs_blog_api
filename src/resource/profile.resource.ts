import { ProfileGender, Profile } from "entity/profile.entity";

import ResourceAbstract from "resource/resource.abstract";

export interface IProfileResource {
  id: number;
  phone: string;
  gender: ProfileGender;
}

export default class ProfileResource extends ResourceAbstract {
  constructor(data: Profile) {
    super(data);
  }

  public async toJson(profile: any = this.resource): Promise<IProfileResource> {
    const data = this.format(profile) as IProfileResource;
    return data;
  }

  public format(item: Profile): IProfileResource {
    return {
      id: item.id,
      phone: item.phone,
      gender: item.gender,
    } as IProfileResource;
  }
}
