import { ProfileGender } from "entity/profile.entity";

export interface IProfile {
  gender: ProfileGender;
  phone: string;
}
