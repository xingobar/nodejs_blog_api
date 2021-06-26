import { Controller, Get, Params, Put, Request, Response } from "@decorators/express";
import UserService from "service/user.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import { Container } from "typedi";
import { User } from "entity/user.entity";
import ProfileValidator from "validator/profile.validator";
import { IProfile } from "interface/profile.interface";
import { ProfileService } from "service/profile.service";
import { Profile } from "entity/profile.entity";

@Controller("/users")
class ProfileController {
  // 取得個人資料
  @Get("/:userId/profiles", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userService = Container.get(UserService);
    let user: User | undefined = await userService.findByAccount(req.user.account, ["profile"]);

    res.json({ user });
  }

  /**
   * 更新資料
   * @param req
   * @param res
   */
  @Put("/:userId/profiles", [AuthenticateMiddleware])
  public async update(@Request() req: any, @Response() res: any) {
    const payload: IProfile = req.body;

    const v = new ProfileValidator(req.body);
    v.update().validate();

    if (v.isError()) {
      return res.status(400).json({ error: v.detail });
    }

    const profileService: ProfileService = Container.get(ProfileService);

    const profile: Profile | undefined = await profileService.update(req.user, payload);

    res.json({ profile: profile });
  }
}

export default ProfileController;
