import { Controller, Get, Request, Response, Post } from "@decorators/express";
import { Container } from "typedi";
import { IGetAllPostParams } from "interface/post.interface";
import { Post as PostEntity } from "entity/post.entity";
import { LikeableEntityType } from "entity/likeable.entity";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";

import PostService from "service/post.service";
import VerifyTokenMiddleware from "middleware/verify.token.middleware";
import PostResource from "resource/post.resource";
import NotFoundException from "exception/notfound.exception";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import LikeableService from "service/likeable.service";
import BookmarkService from "service/bookmark.service";
import ViewLogService from "service/view.log.service";

@Controller("/posts")
export default class PostController {
  // 取得文章列表
  @Get("/", [VerifyTokenMiddleware])
  public async index(@Request() req: any, @Response() res: any) {
    const params: IGetAllPostParams = req.query;

    // 設定預設值
    params.page = params.page ?? 1;
    params.limit = params.limit ?? 10;

    // 排除使用者
    let excludeUser: number = 0;

    if (req.user) {
      excludeUser = req.user.id;
    }

    /**
     * 預設依照創建時間排序
     * 評價分數
     * 觀看次數
     * 喜歡次數
     */
    params.orderBy = params?.orderBy ?? { column: "created_at", sort: "DESC" };

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

  // 顯示單一文章
  @Get("/:postId", [VerifyTokenMiddleware])
  public async show(@Request() req: any, @Response() res: any) {
    const postService: PostService = Container.get(PostService);
    const viewLogService: ViewLogService = Container.get(ViewLogService);

    const post: PostEntity = await postService.findById(req.params.postId).join((p) => p.user);

    await post.user;

    if (!post) {
      throw new NotFoundException();
    }

    // 有登入的話新增觀看紀錄

    if (req.user) {
      const viewLog: ViewLog | undefined = await viewLogService.findById({
        userId: req.user.id,
        entityType: ViewLogEntityType.Post,
        entityId: post.id,
      });

      if (!viewLog) {
        await viewLogService.createLog({ userId: req.user.id, entity: post });
      }
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
    const like = await likeableService.findByIdAndEntity({
      userId: req.user.id,
      entityId: post.id,
      entityType: LikeableEntityType.Post,
    });

    let status: boolean = false;

    if (like) {
      await likeableService.deleteByEntity(like);
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

  // 收藏文章
  @Post("/:postId/bookmarks", [AuthenticateMiddleware])
  public async bookmarked(@Request() req: any, @Response() res: any) {
    const bookmarkService: BookmarkService = Container.get(BookmarkService);

    const postService: PostService = Container.get(PostService);

    const post: PostEntity = await postService.findById(req.params.postId);

    if (!post) {
      throw new NotFoundException();
    }

    /**
     * 檢查是否已加入過標籤
     * 倘若已加入的話則取消書籤,
     * 反之則加入
     */
    const bookmark: Bookmark | undefined = await bookmarkService.findByUserIdAndEntity({
      userId: req.user.id,
      entityType: BookmarkEntityType.Post,
      entityId: post.id,
    });
    if (bookmark) {
      await bookmarkService.unBookmarkedPost(bookmark);

      return res.json({ status: false });
    }

    await bookmarkService.bookmarkedPost({ userId: req.user.id, entity: post });

    return res.json({ status: true });
  }
}
