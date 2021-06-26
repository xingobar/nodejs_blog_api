import { Request, Response, Get, Controller } from "@decorators/express";
import AuthenticateMiddleware from "middleware/authenticate.middleware";

@Controller("/users")
export default class UserController {
  @Get("/", [AuthenticateMiddleware])
  public index(@Request() req: any, @Response() res: any) {
    res.json({ user: req.user });
  }
}
