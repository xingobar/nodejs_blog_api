import { Controller, Get, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import PostService from "service/post.service";
import PostResource from "resource/post.resource";
import NotFoundException from "exception/notfound.exception";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";

// swagger
import { ApiPath, ApiOperationGet, SwaggerDefinitionConstant } from "swagger-express-ts";
import { injectable } from "inversify";
import { interfaces } from "inversify-express-utils";

@ApiPath({
  path: "/posts",
  description: "推薦的文章",
  name: "RecommendsPost",
})
@injectable()
@Controller("/posts")
export default class RecommendController implements interfaces.Controller {
  public static TARGET_NAME: string = "RecommendController";

  @ApiOperationGet({
    path: "/:postId/popularity",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "取得目前最受歡迎的文章",
    description: "取得目前最受歡迎的文章",
    responses: {
      404: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "PostPaginationResponse",
      },
    },
  })
  // 取得目前最受歡迎的文章
  @Get("/:postId/popularity")
  public async popularity(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findByIdWithPublished(req.params.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const posts = await postService.getPopularity(req.params.postId);

    const postResource = new PostResource(posts.data);

    posts.data = await postResource.toArray();

    return res.json(posts);
  }

  @ApiOperationGet({
    path: "/:postId/recommends",
    security: {
      authorization: ["Bearer <token>"],
    },
    summary: "其他人也觀看的文章",
    description: "其他人也觀看的文章",
    responses: {
      404: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "NotFoundException",
      },
      200: {
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: "PostPaginationResponse",
      },
    },
  })
  // 其他人也觀看的文章
  @Get("/:postId/recommends", [VerifyTokenMiddleware])
  public async recommends(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findByIdWithPublished(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    const posts = await postService.getOtherPopularityRead(req.params.postId, req.session.user?.id ?? 0);

    const postResource = new PostResource(posts.data);

    posts.data = await postResource.toArray();

    return res.json(posts);
  }
}
