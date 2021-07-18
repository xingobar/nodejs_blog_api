import UserService from "service/user.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import ProfileValidator from "validator/profile.validator";
import UserResource from "resource/user.resource";
import ProfileResource from "resource/profile.resource";
import NotFoundException from "exception/notfound.exception";

import { Container } from "typedi";
import { User } from "entity/user.entity";
import { IProfile } from "interface/profile.interface";
import { ProfileService } from "service/profile.service";
import { Profile } from "entity/profile.entity";
import { Controller, Get, Post, Request, Response } from "@decorators/express";

// swagger
import { ApiPath, ApiOperationGet, SwaggerDefinitionConstant, ApiOperationPost } from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";

@ApiPath({
  path: "/api/users/",
  name: "Profile",
})
@injectable()
@Controller("/users")
class ProfileController implements interfaces.Controller {
  public static TARGET_NAME: string = "ProfileController";

  @ApiOperationGet({
    path: "/profiles",
    description: "取得個人資料",
    summary: "取得個人資料",
    responses: {
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        description: "取得成功",
        model: "UserResponse",
      },
    },
  })
  // 取得個人資料
  @Get("/profiles", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userService = Container.get(UserService);
    const user: User | undefined = await userService.findByAccount(req.session.user.account).join((u) => u.profile);

    await user.profile;

    if (!user.hasOwnProperty("profile")) {
      throw new NotFoundException();
    }

    const resource: UserResource = new UserResource(user);

    res.json(await resource.toJson());
  }

  @ApiOperationPost({
    path: "/profiles",
    description: "儲存或更新個人資料",
    summary: "儲存或更新個人資料",
    parameters: {
      body: {
        model: "CreateProfileRequest",
      },
    },
    responses: {
      200: {
        description: "成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "ProfileResponse",
      },
      400: {
        description: "資料有誤",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "InvalidRequestException",
      },
    },
  })
  /**
   * 儲存或更新個人資料
   * @param req
   * @param res
   */
  @Post("/profiles", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    const payload: IProfile = req.body;

    const v = new ProfileValidator(req.body);
    v.update().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const profileService: ProfileService = Container.get(ProfileService);

    // 更新 or 新增資料
    const profile: Profile | undefined = await profileService.updateOrCreate(req.session.user, payload);

    const profileResource: ProfileResource = new ProfileResource(profile ?? new Profile());

    return res.json(await profileResource.toJson());
  }
}

export default ProfileController;
