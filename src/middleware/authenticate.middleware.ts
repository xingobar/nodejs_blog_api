import { Middleware } from "@decorators/express";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config/index";
import InvalidException from "exception/invalid.exception";

export default class AuthenticateMiddleware implements Middleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // token 找不到
    if (!token) return res.status(401).json({ message: "尚未登入" });

    // jwt token 驗證
    jwt.verify(token ?? "", config.jwt.secret, (err: any, user: any) => {
      if (err) {
        throw new InvalidException("token 有誤請重新登入");
      }

      req.user = user;

      next();
    });
  }
}
