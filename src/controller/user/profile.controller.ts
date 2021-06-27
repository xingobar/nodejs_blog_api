import UserService from "service/user.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import ProfileValidator from "validator/profile.validator";
import ProfilePolicy from "policy/profile.policy";
import AccessDeniedException from "exception/access.denied.exception";
import UserResource from "resource/user.resource";

import { Container } from "typedi";
import { User } from "entity/user.entity";
import { IProfile } from "interface/profile.interface";
import { ProfileService } from "service/profile.service";
import { Profile } from "entity/profile.entity";
import { Controller, Get, Post, Request, Response } from "@decorators/express";

@Controller("/users")
class ProfileController {
  // 取得個人資料
  @Get("/:userId/profiles", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userService = Container.get(UserService);
    let user: User | undefined = await userService.findByAccount(req.user.account, ["profile"]);

    const resource: UserResource = new UserResource(user);

    res.json(await resource.toJson());
  }

  /**
   * 儲存或更新個人資料
   * @param req
   * @param res
   */
  @Post("/:userId/profiles", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    const payload: IProfile = req.body;

    const v = new ProfileValidator(req.body);
    v.update().validate();

    if (v.isError()) {
      return res.json({ error: v.detail });
    }

    const profileService: ProfileService = Container.get(ProfileService);

    // 已經有 profile 的資料的話，就要檢查是否更新自己的 profile
    if (req.user.profileId && profileService.findById(req.user.profileId)) {
      // 檢查 profile 是否為自己
      const profilePolicy: ProfilePolicy = Container.get(ProfilePolicy);
      if (!profilePolicy.update(req.user, req.params.userId)) {
        throw new AccessDeniedException();
      }
    }

    // 更新 or 新增資料
    const profile: Profile | undefined = await profileService.updateOrCreate(req.user, payload);

    return res.json({ profile });
  }
}

export default ProfileController;
