import { Controller, Post, Request, Response, Put, Delete, Get } from "@decorators/express";
import { ICreatePost, IUpdatePost } from "interface/post.interface";
import { Container } from "typedi";
import { BookmarkEntityType } from "entity/bookmark.entity";
import { LikeableEntityType } from "entity/likeable.entity";

import PostService from "service/post.service";
import PostResource from "resource/post.resource";
import NotFoundException from "exception/notfound.exception";
import BookmarkService from "service/bookmark.service";
import PostValidator from "validator/post.validator";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import LikeableService from "service/likeable.service";
import PaginatorLib from "lib/paginator.lib";
import PostPolicy from "policy/post.policy";
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

// 使用者文章
interface IPostIndex {
  keyword?: string;
}

@ApiPath({
  path: "/api/users/posts",
  name: "UserPost",
})
@injectable()
@Controller("/users/posts")
export default class UserPostController implements interfaces.Controller {
  public static TARGET_NAME: string = "UserPostController";

  @ApiOperationGet({
    path: "/",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "取得文章列表",
    description: "取得文章列表",
    responses: {
      200: {
        description: "成功",
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: "PostResponse",
      },
    },
  })
  // 取得文章列表
  @Get("/", [AuthenticateMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    // 關鍵字查詢
    const params: IPostIndex = req.query;

    const posts = await postService.findByUserIdPaginator({ userId: req.session.user.id, keyword: params.keyword });

    const postResource = new PostResource(posts.data);

    posts.data = await postResource.toArray();

    return res.json(posts);
  }

  @ApiOperationPost({
    path: "/",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "新增文章",
    description: "新增文章",
    parameters: {
      body: {
        model: "CreateUserPostRequest",
      },
    },
    responses: {
      200: {
        description: "新增成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "PostResponse",
      },
    },
  })
  // 新增文章
  @Post("/", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    const params: ICreatePost = req.body;

    const v = new PostValidator(req.body);
    v.storeRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const postService: PostService = Container.get(PostService);

    const post = await postService.createPost(params, req.session.user.id);

    const resource = new PostResource(post);

    return res.json(await resource.toJson());
  }

  @ApiOperationPut({
    path: "/:postId",
    security: {
      authorization: ["Bearer <token>"],
    },
    parameters: {
      path: {
        postId: {
          description: "文章編號",
          type: SwaggerDefinitionConstant.INTEGER,
        },
      },
      body: {
        model: "UpdateUserPostRequest",
      },
    },
    summary: "更新文章",
    description: "更新文章",
    responses: {
      404: {
        description: "找不到文章",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
      200: {
        description: "更新成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "PostResponse",
      },
    },
  })
  // 更新文章
  @Put("/:postId", [AuthenticateMiddleware])
  public async update(@Request() req: any, @Response() res: any) {
    const params: IUpdatePost = req.body;

    const v = new PostValidator(req.body);
    v.updateRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const postService: PostService = Container.get(PostService);

    let post = await postService.findById(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    const postPolicy: PostPolicy = Container.get(PostPolicy);

    if (!postPolicy.update(req.session.user, post)) {
      throw new AccessDeniedException();
    }

    post = await postService.updateById(post.id, params);

    const resource = new PostResource(post);

    return res.json(await resource.toJson());
  }

  @ApiOperationDelete({
    path: "/:postId",
    summary: "刪除文章",
    description: "刪除文章",
    security: {
      authorization: ["Bearer <token>"],
    },
    parameters: {
      path: {
        postId: {
          type: SwaggerDefinitionConstant.INTEGER,
          description: "文章編號",
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
  // 刪除文章
  @Delete("/:postId", [AuthenticateMiddleware])
  public async destroy(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findById(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    const postPolicy: PostPolicy = Container.get(PostPolicy);

    if (!postPolicy.delete(req.session.user, post)) {
      throw new AccessDeniedException();
    }

    await postService.deleteById(req.params.postId);

    return res.json({
      ok: "ok",
    });
  }

  // 取得使用者書籤
  @Get("/bookmarks", [AuthenticateMiddleware])
  public async bookmarks(@Request() req: any, @Response() res: any) {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;

    const bookmarkService: BookmarkService = Container.get(BookmarkService);

    // 取得分頁資料
    const bookmarks = await bookmarkService.findPaginatorByUserId(req.session.user.id, BookmarkEntityType.Post, { page, limit });

    // 取得總共的比數
    const total = await bookmarkService.findTotalByUserId(req.session.user.id, BookmarkEntityType.Post);

    const posts = bookmarks.map((bookmark) => bookmark.post);

    const postResource = new PostResource(posts);

    return res.json(
      PaginatorLib.paginate({
        data: await postResource.toArray(),
        total,
        page,
        limit,
      })
    );
  }

  // 取得使用者喜歡的文章
  @Get("/likes", [AuthenticateMiddleware])
  public async likes(@Request() req: any, @Response() res: any) {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;

    const likeableService: LikeableService = Container.get(LikeableService);

    const likes = await likeableService.findPaginatorByUserId(req.session.user.id, LikeableEntityType.Post, { page, limit });

    const posts = likes.map((like) => like.post);

    const total = await likeableService.findTotalByUserId(req.session.user.id, LikeableEntityType.Post);

    const postResource = new PostResource(posts);

    return res.json(
      PaginatorLib.paginate({
        data: await postResource.toArray(),
        page,
        limit,
        total,
      })
    );
  }
}
