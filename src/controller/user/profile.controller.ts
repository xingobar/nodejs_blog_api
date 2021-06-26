import { Controller, Get, Params, Request, Response } from "@decorators/express";
import UserService from "service/user.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import Container from "typedi";
import { User } from "entity/user.entity";

@Controller("/users")
class ProfileController {
  // 取得個人資料
  @Get("/:userId/profiles", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userService = Container.get(UserService);
    let user: User | undefined = await userService.findByAccount(req.user.account, ["profile"]);

    res.json({ user });
  }
}

export default ProfileController;
