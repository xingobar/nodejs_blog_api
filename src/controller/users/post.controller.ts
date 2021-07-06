import { Controller, Post, Request, Response, Put, Delete } from "@decorators/express";
import PostValidator from "validator/post.validator";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import { ICreatePost, IUpdatePost } from "interface/post.interface";
import { Container } from "typedi";
import PostService from "service/post.service";
import PostResource from "resource/post.resource";
import NotFoundException from "exception/notfound.exception";

@Controller("/users/posts")
export default class PostController {
  // 新增文章
  @Post("/", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    const params: ICreatePost = req.body;

    const v = new PostValidator(req.body);
    v.storeRule().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const postService: PostService = Container.get(PostService);

    const post = await postService.createPost(params);

    post.user = req.user;

    await postService.updateById(post.id, post);

    const resource = new PostResource(post);

    return res.json(await resource.toJson());
  }

  // 更新文章
  @Put("/:postId", [AuthenticateMiddleware])
  public async update(@Request() req: any, @Response() res: any) {
    const params: IUpdatePost = req.body;

    const v = new PostValidator(req.body);
    v.updateRule().validate();

    if (v.isError()) {
      return res.json({ errors: v.detail });
    }

    const postService: PostService = Container.get(PostService);

    let post = await postService.findById(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    post = await postService.updateById(post.id, params);

    const resource = new PostResource(post);

    return res.json(await resource.toJson());
  }

  // 刪除文章
  @Delete("/:postId")
  public async destroy(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findById(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    await postService.deleteById(req.params.postId);

    return res.json({
      ok: "ok",
    });
  }
}
