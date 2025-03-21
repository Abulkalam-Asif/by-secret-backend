import userResolver from "./adminAuthResolver";

const resolvers = {
  Query: {
    ...userResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};

export default resolvers;
