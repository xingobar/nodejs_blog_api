import { Controller, Post, Request, Response, Put, Delete } from "@decorators/express";
import { Container } from "typedi";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import CommentService from "service/comment.service";
import NotFoundException from "exception/notfound.exception";
import CommentValidator from "validator/comment.validator";

@Controller("/posts")
export default class ChildrenController {
  // 新增子留言
  @Post("/:postId/comments/:parentId/children", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    interface ICreateChildrenComment {
      body: string;
    }
    const params: ICreateChildrenComment = req.body;

    const v: CommentValidator = new CommentValidator(params);
    v.storeChildrenRule().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const commentService: CommentService = Container.get(CommentService);

    const parent = await commentService.findParentCommentById(req.params.postId, req.params.parentId);

    if (!parent) {
      throw new NotFoundException();
    }

    const children = await commentService.createChildrenComment(parent, { userId: req.session.user.id, body: params.body });

    return res.json(children);
  }

  // 更新子留言
  @Put("/:postId/comments/:parentId/children/:childrenId")
  public async update(@Request() req: any, @Response() res: any) {
    interface IUpdateChildrenComment {
      body: string;
    }

    const params: IUpdateChildrenComment = req.body;

    const v: CommentValidator = new CommentValidator(params);
    v.updateChildrenRule().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const commentService: CommentService = Container.get(CommentService);

    const parent = await commentService.findParentCommentById(req.params.postId, req.params.parentId);

    if (!parent) {
      throw new NotFoundException();
    }

    let children = await commentService.findChildrenCommentById(parent.id, req.params.childrenId);

    if (!children) {
      throw new NotFoundException();
    }

    children.body = params.body;

    children = await commentService.updateChildren(children);

    return res.json(children);
  }

  /**
   * 刪除子留言
   * @param req
   * @param res
   */
  @Delete("/:postId/comments/:parentId/children/:childrenId")
  public async destroy(@Request() req: any, @Response() res: any) {
    const commentService: CommentService = Container.get(CommentService);

    const parent = await commentService.findParentCommentById(req.params.postId, req.params.parentId);

    if (!parent) {
      throw new NotFoundException();
    }

    let children = await commentService.findChildrenCommentById(parent.id, req.params.childrenId);

    if (!children) {
      throw new NotFoundException();
    }

    await commentService.deleteChildren(children);

    return res.json("ok");
  }
}
