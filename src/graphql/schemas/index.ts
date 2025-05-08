import { adminAuthTypeDefs } from "./adminAuthSchema";
import { generalSettingsTypeDefs } from "./generalSettingsSchema";
import { adsSettingsTypeDefs } from "./adsSettingsSchema";
import { rouletteSettingsTypeDefs } from "./rouletteSettingsSchema";
import { wikiTypeDefs } from "./wikiSchema";
import { advertiserAuthTypeDefs } from "./advertiserAuthSchema";
import { adsCampaignTypeDefs } from "./adsCampaignSchema";
import { rouletteCampaignTypeDefs } from "./rouletteCampaignSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  adsSettingsTypeDefs,
  rouletteSettingsTypeDefs,
  generalSettingsTypeDefs,
  advertiserAuthTypeDefs,
  adsCampaignTypeDefs,
  rouletteCampaignTypeDefs,
];

export default typeDefs;
