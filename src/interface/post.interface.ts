import { User } from "entity/user.entity";

export interface ICreatePost {
  title: string;
  body: string;
  user: User;
}
