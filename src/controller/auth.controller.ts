//import { Request, Response } from "express";
import AuthValidator from "validator/auth.validator";
import { Response, Request, Post, Controller } from "@decorators/express";

@Controller("/auth")
class AuthController {
  /**
   * 註冊
   * @param req
   * @param res
   */
  @Post("/register")
  public register(@Request() req: any, @Response() res: any) {
    const v = new AuthValidator(req.body);
    v.register().validate();

    if (v.isError()) {
      return res.json({ test: v.error });
    }

    res.json({ test: "test" });
  }
}

export default AuthController;
