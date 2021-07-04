import { Request, Response, Get, Controller } from "@decorators/express";
import { injectable } from "inversify";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import UserResource from "resource/user.resource";
import { ApiPath } from "swagger-express-ts";

@ApiPath({
  path: "/users",
  name: "Users",
})
@injectable()
@Controller("/users")
export default class UserController {
  public static TARGET_NAME: string = "UserController";

  @Get("/", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userResource = new UserResource(req.user);
    res.json(await userResource.toJson());
  }
}
