import { Controller, Get, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import PostService from "service/post.service";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";

@Controller("/posts/:postId/recommends")
export default class RecommendController {
  @Get("/", [VerifyTokenMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.recommends(req.params.postId);

    return res.json({ posts });
  }
}
