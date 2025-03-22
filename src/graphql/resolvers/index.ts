import { adminAuthResolver } from "./adminAuthResolver";
import { userResolver } from "./userResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...userResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...userResolver.Mutation,
  },
};

export default resolvers;
