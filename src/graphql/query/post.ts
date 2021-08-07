// node_modules
import { Container } from "typedi";
import { UserInputError } from "apollo-server";

// interface
import { PostSortKeys, PostType } from "graphql/interfaces/post";

// service
import PostService from "graphql/service/post.service";

export default {
  /**
   * 取得多筆文章資料
   */
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
      postType,
    }: {
      before: Date;
      after: Date;
      first: number;
      last: number;
      sortKey: PostSortKeys;
      reverse: boolean;
      query: String;
      postType: PostType;
    },
    context: any
  ) => {
    if (!first && after) throw new UserInputError("after 必須搭配 first");

    if (!last && before) throw new UserInputError("last 和 before 參數要一起傳入");

    if (last && first && before && after) throw new UserInputError("參數有誤");

    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll({
      before,
      after,
      first,
      last,
      sortKey,
      reverse,
      query,
      postType,
      userId: context?.user?.id ?? 0,
    });

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
                  viewCount: post.view_count,
                  likeCount: post.like_count,
                  bookmarkCount: post.bookmark_count,
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

  /**
   * 取得單筆文章
   */
  post: async (root: any, { id }: any, context: any) => {
    const postService: PostService = Container.get(PostService);

    const post = await postService.findById({ id: parseInt(id, 10) });

    return post;
  },
};
