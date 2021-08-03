import { Container } from "typedi";
import PostService from "graphql/service/post.service";

export default {
  posts: async (root: any, { cursor, limit }: any) => {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll({ cursor, limit });

    return {
      edges: posts.map((post) => {
        return {
          cursor: post.createdAt,
          node: post,
        };
      }),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPageCount: 10,
      },
    };
  },
};
