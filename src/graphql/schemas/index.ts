import { adminAuthTypeDefs } from "./adminAuthSchema";
import { adsSettingsTypeDefs } from "./adsSettingsSchema";
import { advertiserTypeDefs } from "./advertiserSchema";
import { rouletteSettingsTypeDefs } from "./rouletteSettingsSchema";
import { userTypeDefs } from "./userSchema";
import { wikiTypeDefs } from "./wikiSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  userTypeDefs,
  adsSettingsTypeDefs,
  rouletteSettingsTypeDefs,
  advertiserTypeDefs,
];

export default typeDefs;
