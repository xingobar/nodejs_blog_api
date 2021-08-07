// node_modules
import { Container } from "typedi";

// service
import PostService from "graphql/service/post.service";
import LikeableService from "graphql/service/likeable.service";

// exception
import NotFoundException from "exception/notfound.exception";
import AccessDeniedException from "exception/access.denied.exception";
import InvalidRequestException from "exception/invalid.exception";

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
      throw new AccessDeniedException();
    }

    const post = await postService.findById(id);

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
};
