import { Response, Request, Post, Controller } from "@decorators/express";
import { Container } from "typedi";

import UserService from "service/user.service";
import AuthValidator from "validator/auth.validator";
import UserResource from "resource/user.resource";

@Controller("/auth")
class AuthController {
  /**
   * 註冊
   * @param req
   * @param res
   */
  @Post("/register")
  public async register(@Request() req: any, @Response() res: any) {
    const v = new AuthValidator(req.body);

    v.register().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const userService: UserService = Container.get(UserService);

    const user = await userService.createUser(req.body);

    const userResource: UserResource = new UserResource(user);

    res.json(await userResource.toJson());
  }

  /**
   * 登入
   * @param req
   * @param res
   */
  @Post("/login")
  public async login(@Request() req: any, @Response() res: any) {
    const v = new AuthValidator(req.body);
    v.login().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const userService: UserService = Container.get(UserService);
    const token: string = await userService.login(req.body);

    return res.json({ token });
  }
}

export default AuthController;
