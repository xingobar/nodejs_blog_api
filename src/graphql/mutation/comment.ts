// service
import PostService from "graphql/service/post.service";
import CommentService from "graphql/service/comment.service";

// node_modules
import { Container } from "typedi";
import { UserInputError } from "apollo-server";

// exception
import AuthorizationException from "exception/authorization.exception";
import NotFoundException from "exception/notfound.exception";
import InvalidRequestException from "exception/invalid.exception";
import AccessDeniedException from "exception/access.denied.exception";

// validator
import CommentValidator from "graphql/validator/comment.validator";

// policy
import CommentPolicy from "graphql/policy/comment.policy";

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

  /**
   * 刪除留言
   *
   * @param {object} args
   * @param {number} args.commentId 留言編號
   * @param {number} args.postId 文章編號
   */
  async commentDelete(parent: any, { commentId, postId }: any, context: any) {
    if (!context.user) {
      throw new AuthorizationException();
    }

    if (!commentId || !postId) {
      throw new UserInputError("請傳入文章以及留言編號");
    }

    const commentService: CommentService = Container.get(CommentService);

    const comment = await commentService.findByCommentAndPostId({ postId, commentId });

    if (!comment) {
      throw new NotFoundException();
    }

    const commentPolicy = Container.get(CommentPolicy);
    if (!commentPolicy.commentDeleteRule(context.user, comment)) {
      throw new AccessDeniedException();
    }

    await commentService.deleteById(commentId);

    return {
      comment,
    };
  },

  /**
   * 留言更新
   * @param {object} args
   * @param {CommentUpdateInput} args.input
   */
  async commentUpdate(parent: any, { input }: any, context: any) {
    if (!context.user) {
      throw new AuthorizationException();
    }

    const { postId, commentId } = input;

    const v = new CommentValidator({ body: input.body });
    v.commentUpdateRule().validate();

    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    if (!commentId || !postId) {
      throw new UserInputError("請傳入文章以及留言編號");
    }

    const commentService: CommentService = Container.get(CommentService);

    let comment = await commentService.findByCommentAndPostId({ postId, commentId });

    if (!comment) {
      throw new NotFoundException();
    }

    const commentPolicy = Container.get(CommentPolicy);

    if (!commentPolicy.commentUpdateRule(context.user, comment)) {
      throw new AccessDeniedException();
    }

    comment = await commentService.updateCommentById({ postId, commentId, body: input.body });

    return {
      comment,
    };
  },

  /**
   *   子留言新增
   *
   * @param {object} args
   * @param {CommentChildrenCreateInput} args.input
   */
  async commentChildrenCreate(parent: any, { input }: any, context: any) {
    const { parentId, postId, body } = input;

    if (!context.user) {
      throw new AuthorizationException();
    }

    const v = new CommentValidator(input);
    v.childrenCommentCreateRule().validate();

    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    const commentService = Container.get(CommentService);

    const parentComment = await commentService.findByCommentAndPostId({ commentId: parentId, postId });

    // 父層留言找不到
    if (!parentComment) {
      throw new NotFoundException();
    }

    const children = await commentService.createChildrenCommentByPostId({
      postId,
      parentId,
      body,
      userId: context.user.id,
    });

    return {
      comment: children,
    };
  },

  /**
   * 子留言更新
   * @param parent
   * @param {object} args
   * @param {CommentChildrenUpdateInput} args.input
   * @param context
   */
  async commentChildrenUpdate(parent: any, { input }: any, context: any) {
    const { parentId, postId, body, id } = input;

    if (!context.user) {
      throw new AuthorizationException();
    }

    const v = new CommentValidator(input);
    v.childrenCommentUpdateRule().validate();

    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    const commentService = Container.get(CommentService);

    let children = await commentService.findChildrenCommentByPostId({ parentId, postId, id });

    if (!children) {
      throw new NotFoundException();
    }

    const commentPolicy = Container.get(CommentPolicy);
    if (!commentPolicy.commentUpdateRule(context.user, children)) {
      throw new AccessDeniedException();
    }

    children = await commentService.updateCommentById({ postId, body, commentId: id });

    return {
      comment: children,
    };
  },

  /**
   * 子留言刪除
   * @param parent
   * @param param1
   * @param context
   */
  async commentChildrenRemove(parent: any, { input }: any, context: any) {
    if (!context.user) {
      throw new AuthorizationException();
    }

    const { id, postId, parentId } = input;

    const v = new CommentValidator(input);
    v.childrenCommentRemoveRule().validate();
    if (v.isError()) {
      throw new InvalidRequestException(v.detail[0].message);
    }

    const commentService = Container.get(CommentService);

    const children = await commentService.findChildrenCommentByPostId({ id, postId, parentId });

    if (!children) {
      throw new NotFoundException();
    }

    const commentPolicy = Container.get(CommentPolicy);

    if (!commentPolicy.commentDeleteRule(context.user, children)) {
      throw new AccessDeniedException();
    }

    await commentService.deleteById(id);

    return {
      comment: children,
    };
  },
};
