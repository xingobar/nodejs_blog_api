import MainRoute from "routes/route.abstract";
import AuthRoute from "routes/auth.routes";
import UserRoute from "routes/user.routes";

const router: MainRoute[] = [new AuthRoute(), new UserRoute()];

export default router;
