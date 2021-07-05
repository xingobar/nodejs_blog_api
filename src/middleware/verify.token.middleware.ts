import { Middleware } from "@decorators/express";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config/index";

export default class VerifyTokenMiddleware implements Middleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // token 找不到
    if (!token) return next();

    // jwt token 驗證
    jwt.verify(token ?? "", config.jwt.secret, (err: any, user: any) => {
      if (err) {
        return next();
      }

      req.user = user;

      next();
    });
  }
}
