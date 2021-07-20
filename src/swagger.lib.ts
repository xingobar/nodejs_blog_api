import * as swagger from "swagger-express-ts";
import logger from "lib/logger.lib";

// api swagger response
import UserResponse from "swagger/response/user.response";
import ProfileResponse from "swagger/response/profile.response";
import PostResponse from "swagger/response/post.response";
import PostLikeResponse from "swagger/response/post.like.response";
import PostBookmarkResponse from "swagger/response/post.bookmark.response";
import OkResponse from "swagger/response/ok.response";
import PostPaginationResponse from "swagger/response/post.pagination.response";
import CommentPaginationResponse from "swagger/response/comment.pagination.response";
import ParentCommentResponse from "swagger/response/parent.comment.response";
import ChildrenCommentResponse from "swagger/response/children.comment.response";

// swagger exception
import NotFoundException from "swagger/exception/notfound.exception";
import InvalidException from "swagger/exception/invalid.exception";
import AccessDeniedException from "swagger/exception/access.denied.exception";

// controller
import AuthController from "controller/auth.controller";
import UserController from "controller/user.controller";
import PostController from "controller/post.controller";
import UserPostController from "controller/users/post.controller";

// api swagger payload
import CreateProfileRequest from "swagger/api/users/create.profile.request";
import CreateUserPostRequest from "swagger/api/users/post/create.user.post.request";
import UpdateUserPostRequest from "swagger/api/users/post/update.user.post.request";

// swagger
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { Container } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";

export class SwaggerLib {
  private container: Container;
  public server: InversifyExpressServer;

  constructor() {
    this.container = new Container();
    this.server = new InversifyExpressServer(this.container);
    this.setSwaggerDefinition();
    this.setErrorConfig();
  }

  // 設定 error config
  public setErrorConfig() {
    this.server.setErrorConfig((app: any) => {
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err);
        const { code, message } = err;
        logger.error(`url = ${req.path}, code => ${res.statusCode}, message => ${message}`);
        return res.status(code ?? 500).json({ message });
      });
    });
  }

  // 設定 swagger defintion
  private setSwaggerDefinition() {
    // note that you *must* bind your controllers to Controller
    this.setSwaggerBindController([AuthController, PostController, UserPostController]);
    this.setSwaggerBindResponse([
      UserResponse,
      InvalidException,
      ProfileResponse,
      CreateProfileRequest,
      PostResponse,
      InvalidException,
      NotFoundException,
      PostLikeResponse,
      PostBookmarkResponse,
      CreateUserPostRequest,
      UpdateUserPostRequest,
      AccessDeniedException,
      OkResponse,
      PostPaginationResponse,
      CommentPaginationResponse,
      ParentCommentResponse,
      ChildrenCommentResponse,
    ]);
  }

  // swagger bind controller
  private setSwaggerBindController(controllers: any[]) {
    controllers.forEach((controller) => {
      this.container.bind<interfaces.Controller>(TYPE.Controller).to(controller).inSingletonScope().whenTargetNamed(controller.TARGET_NAME);
    });
  }

  /**
   * swagger response
   * @param responses
   */
  private setSwaggerBindResponse(responses: any[]) {
    // this.swaggerContainer.bind(UserResponse.name).to(UserResponse);
    responses.forEach((item) => {
      this.container.bind(item.name).to(item);
    });
  }
}

export default new SwaggerLib();
