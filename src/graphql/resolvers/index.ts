import { adminAuthResolver } from "./adminAuthResolver";
import { adsSettingsResolver } from "./adsSettingsResolver";
import { advertiserResolver } from "./advertiserResolver";
import { rouletteSettingsResolver } from "./rouletteSettingsResolver";
import { userResolver } from "./userResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...userResolver.Query,
    ...adsSettingsResolver.Query,
    ...rouletteSettingsResolver.Query,
    ...advertiserResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...userResolver.Mutation,
    ...adsSettingsResolver.Mutation,
    ...rouletteSettingsResolver.Mutation,
    ...advertiserResolver.Mutation,
  },
};

export default resolvers;
