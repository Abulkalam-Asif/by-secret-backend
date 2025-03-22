import { adminAuthTypeDefs } from "./adminAuthSchema";
import { adsSettingTypeDefs } from "./adsSettingSchema";
import { userTypeDefs } from "./userSchema";
import { wikiTypeDefs } from "./wikiSchema";

const typeDefs = [
  adminAuthTypeDefs,
  wikiTypeDefs,
  userTypeDefs,
  adsSettingTypeDefs,
];

export default typeDefs;
