import { Controller, Post, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import CommentService from "service/comment.service";
import NotFoundException from "exception/notfound.exception";

@Controller("/posts")
export default class ChildrenController {
  // 新增子留言
  @Post("/:postId/comments/:parentId/children", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    interface ICreateChildrenComment {
      body: string;
    }
    const params: ICreateChildrenComment = req.body;

    const commentService: CommentService = Container.get(CommentService);

    const parent = await commentService.findParentCommentById(req.params.postId, req.params.parentId);

    if (!parent) {
      throw new NotFoundException();
    }

    const children = await commentService.createChildrenComment(parent, { userId: req.user.id, body: params.body });

    return res.json(children);
  }
}
