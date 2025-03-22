import { adminAuthResolver } from "./adminAuthResolver";
import { adsSettingResolver } from "./adsSettingResolver";
import { userResolver } from "./userResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...userResolver.Query,
    ...adsSettingResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...userResolver.Mutation,
    ...adsSettingResolver.Mutation,
  },
};

export default resolvers;
