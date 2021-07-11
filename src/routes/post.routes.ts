import MainRoute from "routes/route.abstract";
import { attachControllers } from "@decorators/express";
import PostController from "controller/post.controller";
import RecommendController from "controller/posts/recommend.controller";
import CommentController from "controller/posts/comment.controller";
import ChildrenController from "controller/posts/comments/children.controller";
import UploaderController from "controller/uploader.controller";

export default class PostRoute extends MainRoute {
  constructor() {
    super();
    this.setRoutes();
  }

  public setRoutes() {
    attachControllers(this.router, [PostController, RecommendController, CommentController, ChildrenController, UploaderController]);
  }
}
