// service
import PostService from "graphql/service/post.service";
import ViewLogService from "graphql/service/view_log.service";
import CommentService from "graphql/service/comment.service";

// node_modules
import { Container } from "typedi";
import { UserInputError } from "apollo-server";

export default {
  Post: {
    // 文章作者
    author(parent: any, args: any, context: any) {
      return context.dataloader.users.load(parent.userId);
    },
    // 文章日期
    dateTime(parent: any, args: any) {
      return {
        createdAt: parent.createdAt,
        updatedAt: parent.updatedAt,
      };
    },
    // 文章標籤
    tags(parent: any, args: any, context: any) {
      return context.dataloader.tags.load(parent.id);
    },

    /**
     * 取得推薦的文章
     * @param parent
     * @param args
     * @param context
     */
    async recommend(parent: any, args: any, context: any) {
      // 推薦文章

      const postService: PostService = Container.get(PostService);

      const post = await postService.findById({ id: parent.id });

      if (!post) {
        return [];
      }

      const viewLogService = Container.get(ViewLogService);

      // 取得有觀看同樣文章的使用者
      const viewLogs = await viewLogService.findSameReadPostIdUser({ postId: parent.id, userId: context.user.id });
      const otherUsersId = viewLogs.map((logs) => logs.userId);

      // 沒有其他使用者看文章
      if (otherUsersId.length === 0) return [];

      // 取得推薦的文章
      const posts = await viewLogService.recommendPost({ postId: parent.id, usersId: otherUsersId });

      return posts;
    },

    /**
     * 文章留言
     * @param {Post} parent
     * @param {CommentGetInput} args
     * @param context
     */
    async comments(parent: any, { input }: any, context: any) {
      const { first, last, before, after } = input;

      if (!first && after) throw new UserInputError("after 必須搭配 first");

      if (!last && before) throw new UserInputError("last 和 before 參數要一起傳入");

      if (last && first && before && after) throw new UserInputError("參數有誤");

      const commentService = Container.get(CommentService);

      const comments = await commentService.findCommentByPostId({
        postId: parent.id,
        ...input,
      });

      const commentsTotalWithCondition = comments.length === 0 ? 0 : comments[0].total ?? 0;

      const postTotalComments = await commentService.findTotalCommentByPostId(parent.id);

      return {
        edges:
          comments.length === 0
            ? []
            : comments.map((comment) => {
                return {
                  node: {
                    id: comment.id,
                    body: comment.body,
                    userId: comment.userId,
                    createdAt: comment.created_at,
                    updatedAt: comment.updated_at,
                  },
                  cursor: comment.created_at,
                };
              }),
        pageInfo: {
          hasNextPage: first ? commentsTotalWithCondition > first : postTotalComments > commentsTotalWithCondition,
          hasPreviousPage: last ? commentsTotalWithCondition > last : postTotalComments > commentsTotalWithCondition,
          totalPageCount: comments.length === 0 ? 0 : Math.ceil(commentsTotalWithCondition / first || last),
        },
      };
    },
  },
};
