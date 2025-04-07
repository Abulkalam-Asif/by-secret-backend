import { adminAuthResolver } from "./adminAuthResolver";
import { adsSettingsResolver } from "./adsSettingsResolver";
import { advertiserResolver } from "./advertiserResolver";
import { generalSettingsResolver } from "./generalSettingsResolver";
import { rouletteSettingsResolver } from "./rouletteSettingsResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...adsSettingsResolver.Query,
    ...rouletteSettingsResolver.Query,
    ...advertiserResolver.Query,
    ...generalSettingsResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...adsSettingsResolver.Mutation,
    ...rouletteSettingsResolver.Mutation,
    ...advertiserResolver.Mutation,
    ...generalSettingsResolver.Mutation,
  },
};

export default resolvers;
