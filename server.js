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
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }

  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
    allUsers: [User]
    allMovies: [Movie]
    movie(id: ID): Movie
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
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
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
