import { Controller, Get, Request, Response, Post, Delete, Put } from "@decorators/express";
import { Container } from "typedi";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import CommentService from "service/comment.service";
import PostService from "service/post.service";
import NotFoundException from "exception/notfound.exception";
import CommentValidator from "validator/comment.validator";
import CommentPolicy from "policy/comment.policy";
import AccessDeniedException from "exception/access.denied.exception";
import InvalidException from "@src/exception/invalid.exception";

// swagger
import { ApiPath, ApiOperationGet, SwaggerDefinitionConstant, ApiOperationPost } from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";

@ApiPath({
  name: "PostParentComment",
  description: "父曾留言",
  path: "/posts",
})
@injectable()
@Controller("/posts")
export default class CommentController implements interfaces.Controller {
  public static TARGET_NAME: string = "CommentController";

  @ApiOperationGet({
    path: "/:postId/comments",
    summary: "取得文章留言",
    description: "取得文章留言",
    parameters: {
      path: {
        postId: {
          type: SwaggerDefinitionConstant.INTEGER,
          description: "文章編號",
        },
      },
    },
    responses: {
      404: {
        type: SwaggerDefinitionConstant.OBJECT,
        model: "NotFoundException",
      },
      200: {
        type: SwaggerDefinitionConstant.OBJECT,
        model: "CommentPaginationResponse",
      },
    },
  })
  // 取得文章留言
  @Get("/:postId/comments")
  public async index(@Request() req: any, @Response() res: any) {
    const commentService: CommentService = Container.get(CommentService);

    const postService: PostService = Container.get(PostService);

    const post = await postService.findByIdWithPublished(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    const comments = await commentService.findPaginatorChildrenComment(req.params.postId);

    return res.json(comments);
  }

  // 新增留言
  @Post("/:postId/comments", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    interface ICreateComment {
      body: string;
    }

    const params: ICreateComment = req.body;

    const v: CommentValidator = new CommentValidator(params);
    v.storeParentRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const commentService: CommentService = Container.get(CommentService);

    const comment = await commentService.createParentComment({
      body: params.body,
      postId: req.params.postId,
      userId: req.session.user.id,
    });

    return res.json({ comment });
  }

  // 刪除父留言
  @Delete("/:postId/comments/:commentId", [AuthenticateMiddleware])
  public async destroy(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findByIdWithPublished(req.params.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const commentService: CommentService = Container.get(CommentService);

    const comment = await commentService.findParentCommentById(req.params.postId, req.params.commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    const commentPolicy: CommentPolicy = Container.get(CommentPolicy);

    if (!commentPolicy.delete(req.session.user, comment)) {
      throw new AccessDeniedException();
    }

    // 刪除父留言成功
    await commentService.deleteParentByCommentId(comment);

    return res.json("ok");
  }

  /**
   * 更新評論
   * @param req
   * @param res
   */
  @Put("/:postId/comments/:commentId", [AuthenticateMiddleware])
  public async update(@Request() req: any, @Response() res: any) {
    interface IUpdateComment {
      body: string;
    }

    const params: IUpdateComment = req.body;

    const v: CommentValidator = new CommentValidator(params);

    v.updateParentRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const postService: PostService = Container.get(PostService);

    const post = await postService.findByIdWithPublished(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    const commentService: CommentService = Container.get(CommentService);

    let comment = await commentService.findParentCommentById(req.params.postId, req.params.commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    // 檢查是否有權限更新評論
    const commentPolicy: CommentPolicy = Container.get(CommentPolicy);
    if (!commentPolicy.update(req.session.user, comment)) {
      throw new AccessDeniedException();
    }

    comment.body = params.body;

    comment = await commentService.updateComment(comment);

    return res.json(comment);
  }
}
