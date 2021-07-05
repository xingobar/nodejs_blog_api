import { Controller, Get, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import { IGetAllPostParams } from "interface/post.interface";
import { Post as PostEntity } from "entity/post.entity";

import PostService from "service/post.service";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";

@Controller("/posts")
export default class PostController {
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

    return res.json({ posts });
  }
}
