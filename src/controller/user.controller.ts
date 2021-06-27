import { Request, Response, Get, Controller } from "@decorators/express";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import UserResource from "resource/user.resource";

@Controller("/users")
export default class UserController {
  @Get("/", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const userResource = new UserResource(req.user);
    res.json(await userResource.toArray());
  }
}
