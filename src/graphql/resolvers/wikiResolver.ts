import { Wiki } from "../../models/Wiki";

export const wikiResolver = {
  Query: {
    getWiki: async (_: any, __: any, context: any) => {
      const { res } = context;
      try {
        const wiki = await Wiki.findOne();
        // res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        return wiki;
      } catch (error) {
        console.log("Error getting wiki", error);
        return null;
      }
    },
  },
  Mutation: {
    updateWiki: async (
      _: any,
      { content }: { content: string },
      context: any
    ) => {
      const { res } = context;
      try {
        const wiki = await Wiki.findOne();
        if (!wiki) {
          await Wiki.create({ content });
        } else {
          wiki.content = content;
          await wiki.save();
        }
        // res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
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
    },
  },
};
