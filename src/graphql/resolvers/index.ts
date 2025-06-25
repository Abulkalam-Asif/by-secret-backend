import { adminAuthResolver } from "./adminAuthResolver";
import { adsCampaignResolver } from "./adsCampaignResolver";
import { adsSettingsResolver } from "./adsSettingsResolver";
import { bemidiaAdsSettingsResolver } from "./bemidiaAdsSettingsResolver";
import { beMidiaCampaignResolver } from "./beMidiaCampaignResolver";
import { advertiserAuthResolver } from "./advertiserAuthResolver";
import { campaignsCountResolver } from "./campaignsCountResolver";
import { generalSettingsResolver } from "./generalSettingsResolver";
import { rouletteCampaignResolver } from "./rouletteCampaignResolver";
import { rouletteSettingsResolver } from "./rouletteSettingsResolver";
import { wikiResolver } from "./wikiResolver";
import { advertiserSettingsResolver } from "./advertiserSettingsResolver";
import { invoiceResolver } from "./invoiceResolver";
import { stripeKeyResolver } from "./stripeKeyResolver";

const resolvers = {
  Query: {
    ...adminAuthResolver.Query,
    ...wikiResolver.Query,
    ...adsSettingsResolver.Query,
    ...bemidiaAdsSettingsResolver.Query,
    ...rouletteSettingsResolver.Query,
    ...advertiserAuthResolver.Query,
    ...generalSettingsResolver.Query,
    ...adsCampaignResolver.Query,
    ...beMidiaCampaignResolver.Query,
    ...rouletteCampaignResolver.Query,
    ...campaignsCountResolver.Query,
    ...advertiserSettingsResolver.Query,
    ...invoiceResolver.Query,
    ...stripeKeyResolver.Query,
  },
  Mutation: {
    ...adminAuthResolver.Mutation,
    ...wikiResolver.Mutation,
    ...adsSettingsResolver.Mutation,
    ...bemidiaAdsSettingsResolver.Mutation,
    ...rouletteSettingsResolver.Mutation,
    ...advertiserAuthResolver.Mutation,
    ...generalSettingsResolver.Mutation,
    ...adsCampaignResolver.Mutation,
    ...beMidiaCampaignResolver.Mutation,
    ...rouletteCampaignResolver.Mutation,
    ...campaignsCountResolver.Mutation,
    ...advertiserSettingsResolver.Mutation,
    ...invoiceResolver.Mutation,
    ...stripeKeyResolver.Mutation,
  },
};

export default resolvers;
