import { adminAuthResolver } from "./adminAuthResolver";
import { adsSettingResolver } from "./adsSettingResolver";
import { rouletteSettingResolver } from "./rouletteSettingResolver";
import { userResolver } from "./userResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...userResolver.Query,
    ...adsSettingResolver.Query,
    ...rouletteSettingResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...userResolver.Mutation,
    ...adsSettingResolver.Mutation,
    ...rouletteSettingResolver.Mutation,
  },
};

export default resolvers;
