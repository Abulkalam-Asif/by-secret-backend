import { adminAuthTypeDefs } from "./adminAuthSchema";
import { generalSettingsTypeDefs } from "./generalSettingsSchema";
import { adsSettingsTypeDefs } from "./adsSettingsSchema";
import { rouletteSettingsTypeDefs } from "./rouletteSettingsSchema";
import { wikiTypeDefs } from "./wikiSchema";
import { advertiserAuthTypeDefs } from "./advertiserAuthSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  adsSettingsTypeDefs,
  rouletteSettingsTypeDefs,
  generalSettingsTypeDefs,
  advertiserAuthTypeDefs,
];

export default typeDefs;
