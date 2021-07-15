import { User } from "entity/user.entity";
// import { Express, Request } from "express";
declare global {
  namespace Express {
    interface Request {
      // 使用者資訊
      user: User;

      // session 資訊
      session: session.Session;
    }
  }
}
