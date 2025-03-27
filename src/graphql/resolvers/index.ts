import { adminAuthResolver } from "./adminAuthResolver";
import { adsSettingsResolver } from "./adsSettingsResolver";
import { advertiserResolver } from "./advertiserResolver";
import { rouletteSettingsResolver } from "./rouletteSettingsResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...adsSettingsResolver.Query,
    ...rouletteSettingsResolver.Query,
    ...advertiserResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...adsSettingsResolver.Mutation,
    ...rouletteSettingsResolver.Mutation,
    ...advertiserResolver.Mutation,
  },
};

export default resolvers;
