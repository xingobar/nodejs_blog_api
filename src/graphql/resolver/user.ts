// service
import PostService from "graphql/service/post.service";

// node_modules
import { Container } from "typedi";

// entity
import { PostStatus } from "entity/post.entity";

// exception
import InvalidRequestException from "exception/invalid.exception";

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
    posts: async ({ id }: any, { status }: any, context: any) => {
      const postService: PostService = Container.get(PostService);

      if (!status) {
        status = PostStatus.PUBLISH;
      }

      // 不是登入的使用者則不能取得草稿文章以及下架的文章
      if (context.user && context.user?.id !== id && [PostStatus.OFFLINE, PostStatus.DRAFT].includes(status)) {
        throw new InvalidRequestException("文章狀態有誤");
      }

      // 跟登入的使用者一樣的話, 可以取得草稿的資料
      const posts = await postService.findByUsersId({
        userId: id,
        status,
      });

      return posts;
    },
  },
};
