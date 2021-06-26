import { User } from "entity/user.entity";
// import { Express, Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
