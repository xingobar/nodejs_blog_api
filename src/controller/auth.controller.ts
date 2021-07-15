import { Response, Request, Post, Controller } from "@decorators/express";
import { Container } from "typedi";

import UserService from "service/user.service";
import AuthValidator from "validator/auth.validator";
import UserResource from "resource/user.resource";

import { ApiPath, ApiOperationPost, SwaggerDefinitionConstant } from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import { IAuthInput } from "interface/auth.interface";

import NotFoundException from "exception/notfound.exception";
import InvalidException from "exception/invalid.exception";

@ApiPath({
  path: "/auth",
  name: "Auth",
})
@injectable()
@Controller("/auth")
class AuthController implements interfaces.Controller {
  public static TARGET_NAME: string = "AuthController";

  /**
   * 註冊
   * @param req
   * @param res
   */
  @ApiOperationPost({
    description: "註冊",
    summary: "註冊",
    parameters: {
      formData: {
        account: {
          required: true,
          description: "帳號",
          type: "string",
        },
        password: {
          required: true,
          description: "密碼",
          type: "string",
        },
      },
    },
    responses: {
      200: {
        description: "成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "UserResponse",
      },
    },
  })
  @Post("/register")
  public async register(@Request() req: any, @Response() res: any) {
    const params: IAuthInput = req.body;

    const v = new AuthValidator(req.body);

    v.register().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const userService: UserService = Container.get(UserService);

    // 檢查信箱
    if ((await userService.findByEmail(params.email)) !== undefined) {
      throw new InvalidException("電子信箱已存在");
    }

    // 帳號檢查
    if ((await userService.findByAccount(params.account)) !== undefined) {
      throw new InvalidException("帳號已存在");
    }

    // 新增會員
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

    // 找不到使用者
    const user = await userService.findByAccount(req.body.account);
    if (!user) {
      throw new NotFoundException();
    }

    // 檢查密碼是否一致
    if (await userService.checkPasswordMatch(req.body)) {
      const token = userService.generateJwtToken(user);

      // 將 user 存入 session
      req.session.user = user;

      return res.json({ token });
    } else {
      throw new InvalidException("密碼錯誤");
    }
  }
}

export default AuthController;
