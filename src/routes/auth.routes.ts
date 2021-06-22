import MainRoute from "routes/route.abstract";
import AuthController from "controller/authController";
class AuthRoute extends MainRoute {
  private authController: AuthController = new AuthController();

  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get("/auth/register", this.authController.register);
  }
}

export default AuthRoute;
