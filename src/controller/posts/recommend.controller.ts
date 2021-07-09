import { Controller, Get, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import PostService from "service/post.service";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";
import PostResource from "resource/post.resource";

@Controller("/posts")
export default class RecommendController {
  // 取得目前最受歡迎的文章
  @Get("/:postId/popularity", [VerifyTokenMiddleware])
  public async popularity(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.getPopularity(req.params.postId);

    const postResource = new PostResource(posts);

    return res.json(await postResource.toArray());
  }

  // 其他人也觀看的文章
  @Get("/:postId/recommends", [VerifyTokenMiddleware])
  public async recommends(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.getOtherPopularityRead(req.params.postId, req?.user.id ?? 0);

    const postResource = new PostResource(posts);

    return res.json(await postResource.toArray());
  }
}
