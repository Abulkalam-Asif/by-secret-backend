import { adminAuthResolver } from "./adminAuthResolver";
import { adsCampaignResolver } from "./adsCampaignResolver";
import { adsSettingsResolver } from "./adsSettingsResolver";
import { advertiserAuthResolver } from "./advertiserAuthResolver";
import { generalSettingsResolver } from "./generalSettingsResolver";
import { rouletteCampaignResolver } from "./rouletteCampaignResolver";
import { rouletteSettingsResolver } from "./rouletteSettingsResolver";
import { wikiResolver } from "./wikiResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...adsSettingsResolver.Query,
    ...rouletteSettingsResolver.Query,
    ...advertiserAuthResolver.Query,
    ...generalSettingsResolver.Query,
    ...adsCampaignResolver.Query,
    ...rouletteCampaignResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...adsSettingsResolver.Mutation,
    ...rouletteSettingsResolver.Mutation,
    ...advertiserAuthResolver.Mutation,
    ...generalSettingsResolver.Mutation,
    ...adsCampaignResolver.Mutation,
    ...rouletteCampaignResolver.Mutation,
  },
};

export default resolvers;
