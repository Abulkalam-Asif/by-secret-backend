import { adminAuthTypeDefs } from "./adminAuthSchema";
import { adsSettingsTypeDefs } from "./adsSettingsSchema";
import { advertiserTypeDefs } from "./advertiserSchema";
import { rouletteSettingsTypeDefs } from "./rouletteSettingsSchema";
import { wikiTypeDefs } from "./wikiSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  adsSettingsTypeDefs,
  rouletteSettingsTypeDefs,
  advertiserTypeDefs,
];

export default typeDefs;
