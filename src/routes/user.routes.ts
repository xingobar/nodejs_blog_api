import MainRoute from "routes/route.abstract";
import { attachControllers } from "@decorators/express";
import UserController from "controller/user.controller";
import ProfileController from "controller/user/profile.controller";

class UserRoute extends MainRoute {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    attachControllers(this.router, [UserController, ProfileController]);
  }
}

export default UserRoute;