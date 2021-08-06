import { Container } from "typedi";
import { UserInputError } from "apollo-server";
import { PostSortKeys } from "graphql/interfaces/post";
import PostService from "graphql/service/post.service";

export default {
  posts: async (
    root: any,
    {
      before,
      after,
      first,
      last,
      sortKey,
      reverse,
      query,
    }: { before: Date; after: Date; first: number; last: number; sortKey: PostSortKeys; reverse: boolean; query: String }
  ) => {
    if (!first && after) throw new UserInputError("after 必須搭配 first");

    if (!last && before) throw new UserInputError("last 和 before 參數要一起傳入");

    if (last && first && before && after) throw new UserInputError("參數有誤");

    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll({ before, after, first, last, sortKey, reverse, query });

    // 資料筆數
    const totalCount = await postService.findCount({ after, before });

    // 達成條件的資料數
    const postCount = parseInt(posts[0]?.count ?? 0);

    return {
      edges:
        postCount === 0
          ? []
          : posts.map((post) => {
              return {
                cursor: post.created_at ?? "",
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
