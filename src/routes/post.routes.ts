import MainRoute from "routes/route.abstract";
import { attachControllers } from "@decorators/express";
import PostController from "controller/post.controller";

export default class PostRoute extends MainRoute {
  constructor() {
    super();
    this.setRoutes();
  }

  public setRoutes() {
    attachControllers(this.router, [PostController]);
  }
}
