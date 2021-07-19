import { Controller, Post, Request, Response, Put, Delete } from "@decorators/express";
import { Container } from "typedi";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import CommentService from "service/comment.service";
import NotFoundException from "exception/notfound.exception";
import CommentValidator from "validator/comment.validator";
import CommentPolicy from "policy/comment.policy";
import AccessDeniedException from "exception/access.denied.exception";

// swagger
import {
  ApiPath,
  ApiOperationPost,
  SwaggerDefinitionConstant,
  ApiOperationGet,
  ApiOperationPut,
  ApiOperationDelete,
} from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";

@ApiPath({
  path: "/posts",
  description: "子曾留言",
  name: "PostChildrenComment",
})
@injectable()
@Controller("/posts")
export default class ChildrenController implements interfaces.Controller {
  public static TARGET_NAME: string = "ChildrenController";

  @ApiOperationPost({
    path: "/:postId/comments/:parentId/children",
    summary: "新增子留言",
    description: "新增子留言",
    security: {
      authorization: ["Bearer <token>"],
    },
    parameters: {
      path: {
        postId: {
          description: "文章編號",
          required: true,
        },
        parentId: {
          description: "父曾留言編號",
          required: true,
        },
      },
    },
    responses: {
      400: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "InvalidRequestException",
      },
      404: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "ChildrenCommentResponse",
      },
    },
  })
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
      return res.status(400).json({ errors: v.detail });
    }

    const commentService: CommentService = Container.get(CommentService);

    const parent = await commentService.findParentCommentById(req.params.postId, req.params.parentId);

    if (!parent) {
      throw new NotFoundException();
    }

    const children = await commentService.createChildrenComment(parent, { userId: req.session.user.id, body: params.body });

    return res.json(children);
  }

  @ApiOperationPut({
    path: "/:postId/comments/:parentId/children/:childrenId",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "更新子留言",
    description: "更新子留言",
    parameters: {
      path: {
        postId: {
          description: "文章編號",
          required: true,
        },
        parentId: {
          description: "父曾留言編號",
          required: true,
        },
        childrenId: {
          description: "子留言編號",
          required: true,
        },
      },
      formData: {
        body: {
          type: SwaggerDefinitionConstant.STRING,
          description: "留言內容",
          required: true,
        },
      },
    },
    responses: {
      400: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "InvalidRequestException",
      },
      404: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
      403: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "AccessDeniedException",
      },
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "ChildrenCommentResponse",
      },
    },
  })
  // 更新子留言
  @Put("/:postId/comments/:parentId/children/:childrenId", [AuthenticateMiddleware])
  public async update(@Request() req: any, @Response() res: any) {
    interface IUpdateChildrenComment {
      body: string;
    }

    const params: IUpdateChildrenComment = req.body;

    const v: CommentValidator = new CommentValidator(params);
    v.updateChildrenRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
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

    const commentPolicy: CommentPolicy = Container.get(CommentPolicy);

    if (!commentPolicy.update(req.session.user, children)) {
      throw new AccessDeniedException();
    }

    children.body = params.body;

    children = await commentService.updateChildren(children);

    return res.json(children);
  }

  @ApiOperationDelete({
    path: "/:postId/comments/:parentId/children/:childrenId",
    summary: "刪除子留言",
    description: "刪除子留言",
    security: {
      authorization: ["Bearer <token>"],
    },
    parameters: {
      path: {
        postId: {
          description: "文章編號",
          required: true,
        },
        parentId: {
          description: "父曾留言編號",
          required: true,
        },
        childrenId: {
          description: "子留言編號",
          required: true,
        },
      },
    },
    responses: {
      404: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
      403: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "AccessDeniedException",
      },
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "OkResponse",
      },
    },
  })
  /**
   * 刪除子留言
   * @param req
   * @param res
   */
  @Delete("/:postId/comments/:parentId/children/:childrenId", [AuthenticateMiddleware])
  public async destroy(@Request() req: any, @Response() res: any) {
    const commentService: CommentService = Container.get(CommentService);

    const parent = await commentService.findParentCommentById(req.params.postId, req.params.parentId);

    if (!parent) {
      throw new NotFoundException();
    }

    const children = await commentService.findChildrenCommentById(parent.id, req.params.childrenId);

    if (!children) {
      throw new NotFoundException();
    }

    const commentPolicy: CommentPolicy = Container.get(CommentPolicy);

    if (!commentPolicy.delete(req.session.user, children)) {
      throw new AccessDeniedException();
    }

    await commentService.deleteChildren(children);

    return res.json("ok");
  }
}
