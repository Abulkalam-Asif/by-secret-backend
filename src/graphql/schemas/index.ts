import { adminAuthTypeDefs } from "./adminAuthSchema";
import { generalSettingsTypeDefs } from "./generalSettingsSchema";
import { adsSettingsTypeDefs } from "./adsSettingsSchema";
import { rouletteSettingsTypeDefs } from "./rouletteSettingsSchema";
import { wikiTypeDefs } from "./wikiSchema";
import { advertiserAuthTypeDefs } from "./advertiserAuthSchema";
import { adsCampaignTypeDefs } from "./adsCampaignSchema";
import { rouletteCampaignTypeDefs } from "./rouletteCampaignSchema";
import { campaignsCountTypeDefs } from "./campaignsCountSchema";
import { advertiserSettingsTypeDefs } from "./advertiserSettingsSchema";
import { invoiceTypeDefs } from "./invoiceSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  adsSettingsTypeDefs,
  rouletteSettingsTypeDefs,
  generalSettingsTypeDefs,
  advertiserAuthTypeDefs,
  adsCampaignTypeDefs,
  rouletteCampaignTypeDefs,
  campaignsCountTypeDefs,
  advertiserSettingsTypeDefs,
  invoiceTypeDefs,
];

export default typeDefs;
