import { Controller, Post, Request, Response } from "@decorators/express";
import PostValidator from "validator/post.validator";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import { ICreatePost } from "interface/post.interface";
import { Container } from "typedi";
import PostService from "service/post.service";
import PostResource from "resource/post.resource";
import logger from "lib/logger.lib";

@Controller("/users/posts")
export default class PostController {
  @Post("/", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    const params: ICreatePost = req.body;

    const v = new PostValidator(req.body);
    v.storeRule().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    params.user = req.user;

    const postService: PostService = Container.get(PostService);

    const post = await postService.createPost(params);

    const resource = new PostResource(post);

    return res.json(await resource.toJson());
  }
}
