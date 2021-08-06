import { Container } from "typedi";
import PostService from "graphql/service/post.service";

enum PostSortKeys {
  CREATED_AT,
}

export default {
  posts: async (root: any, { before, after, first, last }: any) => {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll({ before, after, first, last });

    // 資料筆數
    const { total: totalCount } = await postService.findCount({ after, before });

    // 達成條件的資料數
    const postCount = parseInt(posts[0]?.count ?? 0);

    return {
      edges:
        postCount === 0
          ? []
          : posts.map((post) => {
              return {
                cursor: before || after,
                node: {
                  id: post.id,
                  title: post.title,
                  body: post.body,
                  userId: post.userId,
                  createdAt: post.created_at,
                  updatedAt: post.updated_at,
                },
              };
            }),
      pageInfo: {
        hasNextPage: first ? postCount > first : totalCount > postCount,
        hasPreviousPage: last ? postCount > last : totalCount > postCount,
        totalPageCount: Math.ceil(totalCount / (first || last)),
      },
    };
  },
};
