// node_modules
import { Container } from "typedi";

// service
import PostService from "graphql/service/post.service";
import LikeableService from "graphql/service/likeable.service";
import BookmarkService from "graphql/service/bookmark.service";
import TagService from "graphql/service/tag.service";

// exception
import NotFoundException from "exception/notfound.exception";
import AccessDeniedException from "exception/access.denied.exception";
import InvalidRequestException from "exception/invalid.exception";
import AuthorizationException from "exception/authorization.exception";

// validator
import PostValidator from "graphql/validator/post.validator";

// entity
import { PostStatus } from "entity/post.entity";

export default {
  /**
   * 喜歡文章
   *
   * @param {number} id 文章編號
   * @param {boolean} value 喜歡 or 不喜歡文章
   */
  likePost: async (_: any, { id, value }: any, context: any) => {
    const postService: PostService = Container.get(PostService);

    if (!context.user) {
      throw new AuthorizationException();
    }

    const post = await postService.findById({ id });

    if (!post) {
      throw new NotFoundException();
    }

    const likeableService: LikeableService = Container.get(LikeableService);

    let like = await likeableService.findByPostId({ userId: context.user.id, postId: id });

    /**
     * 沒喜歡過文章, 卻帶入不喜歡文章
     * 或者
     * 有喜歡過的文章,卻又帶入喜歡文章
     */
    if ((!like && !value) || (like && value)) {
      throw new InvalidRequestException("傳入的參數有誤");
    }

    // 倘若沒有資料, 但又案讚的話要新增資料
    if (!like && value) {
      await likeableService.likePost({ userId: context.user.id, postId: id });
    }

    // 有資料
    if (like && !value) {
      await likeableService.unlikePost({ userId: context.user.id, postId: id });
    }

    return {
      post,
    };
  },

  /**
   * 收藏文章
   *
   * @param {number} id 文章編號
   * @param {boolean} value 收藏 or 取消收藏
   */
  bookmarkPost: async (_: any, { id, value }: any, context: any) => {
    const postService: PostService = Container.get(PostService);

    if (!context.user) {
      throw new AuthorizationException();
    }

    const post = await postService.findById({ id });

    if (!post) {
      throw new NotFoundException();
    }

    const bookmarkService: BookmarkService = Container.get(BookmarkService);

    const bookmark = await bookmarkService.findBookmarkByPostId({ userId: context.user.id, postId: id });

    // 參數有錯
    if ((bookmark && value) || (!bookmark && !value)) {
      throw new InvalidRequestException("傳入的參數有誤");
    }

    if (bookmark && !value) {
      await bookmarkService.unBookmarkedPost({ userId: context.user.id, postId: id });
    }

    if (!bookmark && value) {
      await bookmarkService.bookmarkedPost({ userId: context.user.id, postId: id });
    }

    return {
      post,
    };
  },

  /**
   * 新增文章
   *
   * @param {object} args
   * @param {PostCreateInput} args.input
   */
  postCreate: async (_: any, { input }: any, context: any) => {
    const { title, body, status }: { title: string; body: string; status: PostStatus } = input;

    // 尚未登入
    if (!context.user) {
      throw new AuthorizationException();
    }

    const v = new PostValidator(input);
    v.postCreateRule().validate();

    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    const tagService = Container.get(TagService);

    const tags = await tagService.findByIds(input.tags);

    if (tags.length !== input.tags.length) {
      throw new InvalidRequestException("標籤資料有誤");
    }

    const postService: PostService = Container.get(PostService);

    // 新增文章
    const post = await postService.createPost({
      title,
      body,
      status,
      userId: context.user.id,
    });

    // 同步標籤
    await postService.syncTags({ post, tagsId: input.tags });

    return {
      post,
    };
  },

  /**
   * 文章更新
   *
   * @param {object} args
   * @param {PostUpdateInput} args.input
   */
  postUpdate: async (_: any, { input }: any, context: any) => {
    const { title, status, body } = input;

    if (!context.user) {
      throw new AuthorizationException();
    }

    const v = new PostValidator(input);
    v.postUpdateRule().validate();

    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    const postService: PostService = Container.get(PostService);

    let post = await postService.findById({ id: input.id });

    // 找不到文章
    if (!post) {
      throw new NotFoundException();
    }

    const tagService = Container.get(TagService);

    // 檢查標籤
    const tags = await tagService.findByIds(input.tags);
    if (tags.length !== input.tags.length) {
      throw new InvalidRequestException("標籤資料有誤");
    }

    // 更新文章
    post = await postService.updatePost({ title, status, body, id: input.id });

    // 同步文章標籤
    await postService.syncTags({ post, tagsId: input.tags });

    return {
      post,
    };
  },
};
