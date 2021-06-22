import MainRoute from "routes/route.abstract";

class AuthRoute extends MainRoute {
  constructor() {
    super();
    this.setRoutes();
  }

  protected setRoutes() {
    this.router.get("/auth/login", (req, res) => {
      console.log("login");
      res.json({ test: "test" });
    });
  }
}

export default AuthRoute;
