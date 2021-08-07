// service
import PostService from "graphql/service/post.service";
import ViewLogService from "graphql/service/view_log.service";

// node_modules
import { Container } from "typedi";

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

      // 取得推薦的文章
      const posts = await viewLogService.recommendPost({ postId: parent.id, usersId: otherUsersId });

      return posts;
    },
  },
};
