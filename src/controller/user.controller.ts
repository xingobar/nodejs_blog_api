import { Request, Response, Get, Controller } from "@decorators/express";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import UserResource from "resource/user.resource";

// swagger
import { ApiPath, ApiOperationGet, SwaggerDefinitionConstant } from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";

@ApiPath({
  path: "/users",
  name: "Users",
  description: "使用者資訊",
})
@injectable()
@Controller("/users")
export default class UserController implements interfaces.Controller {
  public static TARGET_NAME: string = "UserController";

  @ApiOperationGet({
    path: "/",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "取得使用者資訊",
    description: "取得使用者資訊",
    responses: {
      200: {
        description: "成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "UserResponse",
      },
    },
  })
  @Get("/", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userResource = new UserResource(req.session.user);
    res.json(await userResource.toJson());
  }
}
