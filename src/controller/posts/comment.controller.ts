import { Controller, Get, Request, Response, Post, Delete, Put } from "@decorators/express";
import { Container } from "typedi";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import CommentService from "service/comment.service";
import PostService from "service/post.service";
import NotFoundException from "exception/notfound.exception";

@Controller("/posts")
export default class CommentController {
  // 新增留言
  @Post("/:postId/comments", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    interface ICreateComment {
      body: string;
    }

    const params: ICreateComment = req.body;

    const commentService: CommentService = Container.get(CommentService);

    const comment = await commentService.createParentComment({
      body: params.body,
      postId: req.params.postId,
      userId: req.user.id,
    });

    return res.json({ comment });
  }

  // 刪除父留言
  @Delete("/:postId/comments/:commentId", [AuthenticateMiddleware])
  public async destroy(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findById(req.params.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const commentService: CommentService = Container.get(CommentService);

    const comment = await commentService.findParentCommentById(req.params.postId, req.params.commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    // 刪除父留言成功
    await commentService.deleteParentByCommentId(comment);

    // TODO: 刪除子留言

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

    const postService: PostService = Container.get(PostService);

    const post = await postService.findById(req.params.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const commentService: CommentService = Container.get(CommentService);

    let comment = await commentService.findParentCommentById(req.params.postId, req.params.commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    comment.body = params.body;

    comment = await commentService.updateComment(comment);

    return res.json(comment);
  }
}
