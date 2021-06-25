import MainRoute from "routes/route.abstract";
import AuthRoute from "routes/auth.routes";

const router: MainRoute[] = [new AuthRoute()];

export default router;
