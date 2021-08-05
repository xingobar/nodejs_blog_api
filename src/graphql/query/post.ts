import { Container } from "typedi";
import PostService from "graphql/service/post.service";

enum PostSortKeys {
  CREATED_AT,
}

export default {
  posts: async (root: any, { before, after, first, last }: any) => {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll({ before, after, first, last });

    const postCount = await postService.findCount({ after, before, first, last });

    return {
      edges: posts.map((post) => {
        return {
          cursor: post.createdAt,
          node: post,
        };
      }),
      pageInfo: {
        hasNextPage: first ? postCount.cursorCount.total > first : postCount.count > postCount.cursorCount.total,
        hasPreviousPage: last ? postCount.cursorCount.total > last : postCount.count > postCount.cursorCount.total,
        totalPageCount: Math.ceil(postCount.count / (first || last)),
      },
    };
  },
};
