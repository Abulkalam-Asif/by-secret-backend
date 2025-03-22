import { adminAuthTypeDefs } from "./adminAuthSchema";
import { userTypeDefs } from "./userSchema";
import { wikiTypeDefs } from "./wikiSchema";

const typeDefs = [adminAuthTypeDefs, wikiTypeDefs, userTypeDefs];

export default typeDefs;
