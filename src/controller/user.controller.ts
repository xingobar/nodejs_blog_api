import { Request, Response, Get, Controller } from "@decorators/express";
import AuthenticateMiddleware from "middleware/authenticate.middleware";

@Controller("/users", [AuthenticateMiddleware])
export default class UserController {
  @Get("/")
  public index(@Request() req: any, @Response() res: any) {
    res.json({ user: req.user });
  }
}
