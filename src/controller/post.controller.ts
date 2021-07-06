import { Controller, Get, Request, Response, Post } from "@decorators/express";
import { Container } from "typedi";
import { IGetAllPostParams } from "interface/post.interface";
import { Post as PostEntity } from "entity/post.entity";
import { LikeableEntityType } from "entity/likeable.entity";

import PostService from "service/post.service";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";
import PostResource from "resource/post.resource";
import NotFoundException from "exception/notfound.exception";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import LikeableService from "service/likeable.service";

@Controller("/posts")
export default class PostController {
  // 取得文章列表
  @Get("/", [VerifyTokenMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const params: IGetAllPostParams = req.params;

    // 排除使用者
    let excludeUser: number = 0;

    if (req.user) {
      excludeUser = req.user.id;
    }

    // 預設依照創建時間排序
    params.orderBy = params?.orderBy ?? { column: "created_at", sort: "DESC" };

    const postService: PostService = Container.get(PostService);

    const posts: PostEntity[] = await postService.findAllByFilter(params, excludeUser);

    for (let key in posts) {
      await posts[key].user;
    }

    const resource: PostResource = new PostResource(posts);

    return res.json(await resource.toArray());
  }

  // 顯示單一文章
  @Get("/:postId")
  public async show(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post: PostEntity = await postService.findById(req.params.postId).join((post) => post.user);

    await post.user;

    if (!post) {
      throw new NotFoundException();
    }

    const resource: PostResource = new PostResource(post);

    return res.json(await resource.toJson());
  }

  // 喜歡文章
  @Post("/:postId/likes", [AuthenticateMiddleware])
  public async likes(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);

    const post: PostEntity = await postService.findById(req.params.postId);

    // 找不到文章
    if (!post) {
      throw new NotFoundException();
    }

    const likeableService: LikeableService = Container.get(LikeableService);
    const like = await likeableService.findById({
      userId: req.user.id,
      entityId: post.id,
      entityType: LikeableEntityType.Post,
    });

    let status: boolean = false;

    if (like) {
      await likeableService.deleteById({
        userId: req.user.id,
        entityType: LikeableEntityType.Post,
        entity: post,
      });
      status = false;
    } else {
      await likeableService.likePost({
        userId: req.user.id,
        post,
      });
      status = true;
    }

    return res.json({ status });
  }
}
