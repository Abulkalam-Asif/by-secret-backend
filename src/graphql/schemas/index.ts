import { adminAuthTypeDefs } from "./adminAuthSchema";
import { adsSettingTypeDefs } from "./adsSettingSchema";
import { rouletteSettingTypeDefs } from "./rouletteSettingSchema";
import { userTypeDefs } from "./userSchema";
import { wikiTypeDefs } from "./wikiSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  userTypeDefs,
  adsSettingTypeDefs,
  rouletteSettingTypeDefs,
];

export default typeDefs;
