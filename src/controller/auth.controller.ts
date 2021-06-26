import AuthValidator from "validator/auth.validator";
import { Response, Request, Post, Controller } from "@decorators/express";
import UserService from "service/user.service";
import { Container } from "typedi";

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

    res.json({ user });
  }
}

export default AuthController;