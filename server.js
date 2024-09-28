import { ApolloServer, gql } from "apollo-server";

//디비 데이터
const tweets = [
  { id: "1", text: "first one!" },
  { id: "2", text: "second one" },
];

const users = [
  { id: "1", firstName: "nico", lastName: "las" },
  { id: "2", firstName: "Elon", lastName: "Mask" },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    name: String!
  }
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
    allUsers: [User]
  }
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      console.log("const resolvers (allTweets)을 실행함");
      return tweets;
    },
    // tweet(root, args) {
    tweet(root, { id }) {
      console.log("root: ", root);
      // console.log("args: ", args);
      // const { id } = args;
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const tweet = { id: tweets.length + 1, text };
      tweets.push(tweet);
      return tweet;
    },
  },
  User: {
    name({ firstName, lastName }) {
      return `${firstName} - ${lastName}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

//서버생성코드
server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
