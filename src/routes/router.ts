import MainRoute from "routes/route.abstract";
import AuthRoute from "routes/auth.routes";
import UserRoute from "routes/user.routes";
import PostRoute from "routes/post.routes";

const router: MainRoute[] = [new AuthRoute(), new UserRoute(), new PostRoute()];

export default router;
