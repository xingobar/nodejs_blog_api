import MainRoute from "routes/route.abstract";
import { attachControllers } from "@decorators/express";
import UserController from "controller/user.controller";

class UserRoute extends MainRoute {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    attachControllers(this.router, [UserController]);
  }
}

export default UserRoute;
