import { adminAuthResolver } from "./adminAuthResolver";
import { adsCampaignResolver } from "./adsCampaignResolver";
import { adsSettingsResolver } from "./adsSettingsResolver";
import { advertiserAuthResolver } from "./advertiserAuthResolver";
import { campaignsCountResolver } from "./campaignsCountResolver";
import { generalSettingsResolver } from "./generalSettingsResolver";
import { rouletteCampaignResolver } from "./rouletteCampaignResolver";
import { rouletteSettingsResolver } from "./rouletteSettingsResolver";
import { wikiResolver } from "./wikiResolver";
import { advertiserSettingsResolver } from "./advertiserSettingsResolver";

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
    ...campaignsCountResolver.Query,
    ...advertiserSettingsResolver.Query,
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
    ...campaignsCountResolver.Mutation,
    ...advertiserSettingsResolver.Mutation,
  },
};

export default resolvers;
