import { ApolloServer, gql } from "apollo-server";
import { Container } from "typedi";
import authResolver from "graphql/resolver/auth";
import userType from "graphql/types/user";
import UserService from "service/user.service";
import errorType from "graphql/types/error";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # 會員相關
  ${userType}

  # 錯誤資料
  ${errorType}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    users: [User]
  }

  type Mutation {
    """
    註冊會員
    """
    signUp(input: SignUpInput): SignUpPayload
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
  },
  Mutation: {
    // 註冊登入相關
    ...authResolver,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  require("graphql_app");
  console.log(`🚀  Server ready at ${url}`);
});
