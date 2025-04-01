import { Wiki } from "../../models/Wiki";
import { requireAdmin } from "../../middleware/resolverMiddleware";
import { AuthContext } from "../../middleware/authMiddleware";

export const wikiResolver = {
  Query: {
    // Public query - anyone can view the wiki
    getWiki: async (_: any, __: any, context: AuthContext) => {
      try {
        const wiki = await Wiki.findOne();
        return wiki;
      } catch (error) {
        console.log("Error getting wiki", error);
        return null;
      }
    },
  },
  Mutation: {
    // Protected mutation - only admins can update the wiki
    updateWiki: requireAdmin(
      async (
        _: any,
        { content }: { content: string },
        context: AuthContext
      ) => {
        try {
          const wiki = await Wiki.findOne();
          if (!wiki) {
            await Wiki.create({ content });
          } else {
            wiki.content = content;
            await wiki.save();
          }
          return {
            success: true,
            message: "Wiki updated successfully",
          };
        } catch (error) {
          console.log("Error updating wiki", error);
          return {
            success: false,
            message: "Error updating wiki",
          };
        }
      }
    ),
  },
};
