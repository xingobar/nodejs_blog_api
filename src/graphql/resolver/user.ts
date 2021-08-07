// service
import PostService from "graphql/service/post.service";

// node_modules
import { Container } from "typedi";

export default {
  User: {
    /**
     * 取得會員個人資料
     */
    profile: (parent: any, args: any, context: any) => {
      return parent.profileId ? context.dataloader.profiles.load(parent.profileId) : null;
    },

    /**
     * 取得某使用者的文章
     *
     * @param {number} userId 會員編號
     */
    posts: async ({ id }: any, args: any, context: any) => {
      const postService: PostService = Container.get(PostService);

      const posts = await postService.findByUsersId(id);

      return posts;
    },
  },
};
