// node_modules
import { ApolloServer, gql } from "apollo-server";
import { Container } from "typedi";
import { GraphQLDateTime } from "graphql-iso-date";

// entity
import { Tag } from "entity/tag.entity";

// service
import UserService from "service/user.service";
import TagService from "graphql/service/tag.service";

// config
import jwt from "jsonwebtoken";
import config from "config/index";

// graphql type
import errorType from "graphql/types/error";
import tokenType from "graphql/types/token";
import postType from "graphql/types/post";
import userType from "graphql/types/user";
import dateTimeType from "graphql/types/datetime";
import tagType from "graphql/types/tag";

// graphql query
import userQuery from "graphql/query/user";
import postQuery from "graphql/query/post";

// graphql resolver
import authMutation from "graphql/mutation/auth";

// graphql loader
import postResolver from "graphql/resolver/post";

import DataLoader from "dataloader";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # custom scalar
  scalar DateTime

  # 會員相關
  ${userType}

  # 錯誤資料
  ${errorType}

  # jwt token
  ${tokenType}

  # 文章相關
  ${postType}

  # 時間相關
  ${dateTimeType}

  # 標籤
  ${tagType}

  """
  頁碼相關資訊
  """
  type PageInfo {
    """
    是否還有下一頁
    """
    hasNextPage: Boolean!

    """
    是否還有上一頁
    """
    hasPreviousPage: Boolean!

    """
    總頁數
    """
    totalPageCount: Int
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    users: [User]
    user: UserPayload

    """
    文章資料
    """
    posts(
      """
      after cursor
      """
      after: String

      """
      first n element
      """
      first: Int

      """
      last n element
      """
      last: Int

      """
      before cursor
      """
      before: String

      """
      可以排序的 key
      """
      sortKey: PostSortKeys

      """
      是否 reverse 排序, 預設為 true (DESC)
      """
      reverse: Boolean

      """
      關鍵字查詢 (文章標題、內文)
      """
      query: String

      """
      文章類型
      """
      postType: PostType
    ): PostConnection!

    """
    取得單筆文章
    """
    post(
      """
      文章編號
      """
      id: Int
    ): Post
  }

  type Mutation {
    """
    註冊會員
    """
    signUp(input: SignUpInput): SignUpPayload

    """
    登入
    """
    signIn(input: SignInInput): SignInPayload
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    users: () => {
      const userService = Container.get(UserService);

      return userService.getAllUsers();
    },
    // 會員相關
    ...userQuery,

    // 文章相關
    ...postQuery,
  },
  Mutation: {
    // 註冊登入相關
    ...authMutation,
  },
  DateTime: GraphQLDateTime,

  // 文章 resolver
  ...postResolver,
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    let user = undefined;

    try {
      if (!token) {
        user = undefined;
      } else {
        // jwt token 驗證
        user = await jwt.verify(token ?? "", config.jwt.secret);
      }
    } catch (e) {
      console.log("context error: ", e);
    }

    return {
      dataloader: {
        users: new DataLoader(async (userIds) => {
          const userService = Container.get(UserService);
          const users = await userService.findByIds(userIds as number[]);

          return users;
        }),
        tags: new DataLoader(async (postsId) => {
          const tagService = Container.get(TagService);

          const taggables = await tagService.findTagByPostIds(postsId as number[]);

          return postsId.map((postId) => {
            return taggables.filter((taggable) => taggable.postId === postId).map((taggable) => taggable.tag);
          });
        }),
      },
      user,
    };
  },
  formatError: (err) => {
    return {
      message: err.message,
      code: err?.extensions?.exception?.code ?? 500,
      field: err?.extensions?.exception?.field ?? "",
    };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  require("graphql_app");
  console.log(`🚀  Server ready at ${url}`);
});
