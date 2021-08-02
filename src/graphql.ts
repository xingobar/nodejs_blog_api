// node_modules
import { ApolloServer, gql } from "apollo-server";
import { Container } from "typedi";
import { GraphQLDateTime } from "graphql-iso-date";

// service
import UserService from "service/user.service";

// config
import jwt from "jsonwebtoken";
import config from "config/index";

// graphql type
import errorType from "graphql/types/error";
import tokenType from "graphql/types/token";
import postType from "graphql/types/post";
import userType from "graphql/types/user";
import dateTimeType from "graphql/types/datetime";

// graphql query
import userQuery from "graphql/query/user";
import postQuery from "graphql/query/post";

// graphql resolver
import authResolver from "graphql/resolver/auth";

import express from "express";

const app = express();

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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    users: [User]
    user: UserPayload
    posts: [Post]
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
    ...authResolver,
  },
  DateTime: GraphQLDateTime,
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    try {
      if (!token) return {};

      // jwt token 驗證
      const user = await jwt.verify(token ?? "", config.jwt.secret);

      return {
        user,
      };
    } catch (e) {
      console.log("context error: ", e);
      return {};
    }
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  require("graphql_app");
  console.log(`🚀  Server ready at ${url}`);
});
