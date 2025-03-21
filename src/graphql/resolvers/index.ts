import userResolver from "./adminAuthResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...wikiResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...wikiResolver.Mutation,
  },
};

export default resolvers;
