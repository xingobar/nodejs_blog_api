import { Controller, Get, Request, Response, Post } from "@decorators/express";
import { Container } from "typedi";
import { IGetAllPostParams } from "interface/post.interface";
import { Post as PostEntity } from "entity/post.entity";
import { LikeableEntityType } from "entity/likeable.entity";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";

import PostService from "service/post.service";
import PostResource from "resource/post.resource";
import NotFoundException from "exception/notfound.exception";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import LikeableService from "service/likeable.service";
import BookmarkService from "service/bookmark.service";
import ViewLogService from "service/view.log.service";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";

// swagger
import { ApiPath, ApiOperationGet, ApiOperationPost, SwaggerDefinitionConstant } from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";

@ApiPath({
  path: "/api/posts",
  name: "Post",
})
@injectable()
@Controller("/posts")
export default class PostController implements interfaces.Controller {
  public static TARGET_NAME: string = "PostController";

  @ApiOperationGet({
    path: "/",
    summary: "取得文章列表",
    description: "取得文章列表",
    parameters: {
      query: {
        page: {
          type: SwaggerDefinitionConstant.INTEGER,
          description: "目前頁碼",
        },
        limit: {
          type: SwaggerDefinitionConstant.INTEGER,
          description: "每頁幾筆資料",
        },
        column: {
          type: SwaggerDefinitionConstant.STRING,
          description: "排序欄位",
        },
        sort: {
          type: SwaggerDefinitionConstant.STRING,
          description: "排序方式",
        },
      },
    },
    responses: {
      200: {
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: "PostResponse",
      },
    },
  })
  // 取得文章列表
  @Get("/")
  public async index(@Request() req: any, @Response() res: any) {
    const params: IGetAllPostParams = req.query;

    // 設定預設值
    params.page = params.page ?? 1;
    params.limit = params.limit ?? 10;

    // 排除使用者
    let excludeUser: number = 0;

    if (req.session.user) {
      excludeUser = req.session.user.id;
    }

    /**
     * 預設依照創建時間排序
     * 評價分數
     * 觀看次數
     * 喜歡次數
     */
    params.column = params?.column ?? "created_at";
    params.sort = params?.sort ?? "DESC";

    const postService: PostService = Container.get(PostService);

    const posts: PostEntity[] = await postService.findAllByFilter(params, excludeUser);

    for (const key in posts) {
      if (posts.hasOwnProperty(key)) {
        await posts[key].user;
      }
    }

    const resource: PostResource = new PostResource(posts);

    return res.json(await resource.toArray());
  }

  @ApiOperationGet({
    path: "/:postId",
    summary: "顯示某一篇文章",
    description: "顯示某一篇文章",
    parameters: {
      path: {
        postId: {
          description: "文章編號",
          type: SwaggerDefinitionConstant.STRING,
          required: true,
        },
      },
    },
    responses: {
      200: {
        description: "取得成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "PostResponse",
      },
      404: {
        description: "找不到資料",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
    },
  })
  // 顯示單一文章
  @Get("/:postId", [VerifyTokenMiddleware])
  public async show(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);
    const viewLogService: ViewLogService = Container.get(ViewLogService);

    const post: PostEntity = await postService.findByIdWithPublished(req.params.postId).join((p) => p.user);

    await post.user;

    if (!post) {
      throw new NotFoundException();
    }

    // 有登入的話新增觀看紀錄
    if (req.session.user) {
      const viewLog: ViewLog | undefined = await viewLogService.findById({
        userId: req.session.user.id,
        entityType: ViewLogEntityType.Post,
        entityId: post.id,
      });

      if (!viewLog) {
        await viewLogService.createLog({ userId: req.session.user.id, entity: post });
      }
    }

    const resource: PostResource = new PostResource(post);

    return res.json(await resource.toJson());
  }

  @ApiOperationPost({
    path: "/:postId/likes",
    summary: "喜歡文章",
    description: "喜歡文章",
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
      200: {
        description: "成功",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "PostLikeResponse",
      },
      404: {
        description: "找不到資料",
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
    },
  })
  // 喜歡文章
  @Post("/:postId/likes", [AuthenticateMiddleware])
  public async likes(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post: PostEntity = await postService.findByIdWithPublished(req.params.postId);

    // 找不到文章
    if (!post) {
      throw new NotFoundException();
    }

    const likeableService: LikeableService = Container.get(LikeableService);
    const like = await likeableService.findByIdAndEntity({
      userId: req.session.user.id,
      entityId: post.id,
      entityType: LikeableEntityType.Post,
    });

    let status: boolean = false;

    if (like) {
      await likeableService.deleteByEntity(like);
      status = false;
    } else {
      await likeableService.likePost({
        userId: req.session.user.id,
        post,
      });
      status = true;
    }

    return res.json({ status });
  }

  @ApiOperationPost({
    path: "/:postId/bookmarks",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "收藏文章",
    description: "收藏文章",
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
        description: "找不到資料",
        model: "NotFoundException",
      },
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        description: "成功",
        model: "PostBookmarkResponse",
      },
    },
  })
  // 收藏文章
  @Post("/:postId/bookmarks", [AuthenticateMiddleware])
  public async bookmarked(@Request() req: any, @Response() res: any) {
    const bookmarkService: BookmarkService = Container.get(BookmarkService);

    const postService: PostService = Container.get(PostService);

    const post: PostEntity = await postService.findByIdWithPublished(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    /**
     * 檢查是否已加入過標籤
     * 倘若已加入的話則取消書籤,
     * 反之則加入
     */
    const bookmark: Bookmark | undefined = await bookmarkService.findByUserIdAndEntity({
      userId: req.session.user.id,
      entityType: BookmarkEntityType.Post,
      entityId: post.id,
    });
    if (bookmark) {
      await bookmarkService.unBookmarkedPost(bookmark);

      return res.json({ status: false });
    }

    await bookmarkService.bookmarkedPost({ userId: req.session.user.id, entity: post });

    return res.json({ status: true });
  }
}
