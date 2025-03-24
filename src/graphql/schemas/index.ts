import { adminAuthTypeDefs } from "./adminAuthSchema";
import { adsSettingTypeDefs } from "./adsSettingSchema";
import { advertiserTypeDefs } from "./advertiserSchema";
import { rouletteSettingTypeDefs } from "./rouletteSettingSchema";
import { userTypeDefs } from "./userSchema";
import { wikiTypeDefs } from "./wikiSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  userTypeDefs,
  adsSettingTypeDefs,
  rouletteSettingTypeDefs,
  advertiserTypeDefs,
];

export default typeDefs;
