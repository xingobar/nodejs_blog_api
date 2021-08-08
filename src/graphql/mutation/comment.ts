// service
import PostService from "graphql/service/post.service";
import CommentService from "graphql/service/comment.service";

// node_modules
import { Container } from "typedi";

// exception
import AuthorizationException from "exception/authorization.exception";
import NotFoundException from "exception/notfound.exception";
import InvalidRequestException from "exception/invalid.exception";

// validator
import CommentValidator from "graphql/validator/comment.validator";

export default {
  /**
   * 新增留言
   *
   * @param {object} args
   * @param {CommentStoreInput} args.input
   */
  commentStore: async (parent: any, { input }: any, context: any) => {
    const { postId, body } = input;

    if (!context.user) {
      throw new AuthorizationException();
    }

    const v = new CommentValidator(input);
    v.commentStoreRule().validate();

    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    const postService = Container.get(PostService);

    const post = await postService.findById({ id: postId });

    if (!post) {
      throw new NotFoundException();
    }

    const commentService = Container.get(CommentService);

    const comment = await commentService.commentStore({ postId, userId: context.user.id, body });

    return {
      comment,
    };
  },
};
