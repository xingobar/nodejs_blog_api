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

// 使用者文章
interface IPostIndex {
  keyword?: string;
}

@Controller("/users/posts")
export default class PostController {
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

    let post = await postService.findByIdWithPublished(req.params.postId);

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

    const post = await postService.findByIdWithPublished(req.params.postId);

    if (!post) {
      throw new NotFoundException();
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
