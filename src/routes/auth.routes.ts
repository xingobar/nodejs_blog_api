import MainRoute from "routes/route.abstract";
import AuthController from "controller/auth.controller";
import { attachControllers } from "@decorators/express";
class AuthRoute extends MainRoute {
  private authController: AuthController = new AuthController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    //this.router.post("/auth/register", this.authController.register);
    attachControllers(this.router, [AuthController]);
  }
}

export default AuthRoute;
