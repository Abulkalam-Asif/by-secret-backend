import { BeMidiaAdsSettings } from "../../models/BeMidiaAdsSettings";
import { requireAdmin } from "../../middleware/resolverMiddleware";

export const bemidiaAdsSettingsResolver = {
  Query: {
    getBemidiaAdsSettings: requireAdmin(async () => {
      try {
        const bemidiaAdsSettings = await BeMidiaAdsSettings.findOne();
        return bemidiaAdsSettings;
      } catch (error) {
        console.log("Error getting bemidia ads settings", error);
        return null;
      }
    }),
  },
  Mutation: {
    updateBemidiaAdsSettings: requireAdmin(
      async (
        _: any,
        {
          costPerView,
          costPerClick,
          rewardPerView,
          rewardPerClick,
        }: {
          costPerView: number;
          costPerClick: number;
          rewardPerView: number;
          rewardPerClick: number;
        }
      ) => {
        try {
          const bemidiaAdsSettings = await BeMidiaAdsSettings.findOne();
          if (!bemidiaAdsSettings) {
            await BeMidiaAdsSettings.create({
              costPerView,
              costPerClick,
              rewardPerView,
              rewardPerClick,
            });
          } else {
            bemidiaAdsSettings.costPerView = costPerView;
            bemidiaAdsSettings.costPerClick = costPerClick;
            bemidiaAdsSettings.rewardPerView = rewardPerView;
            bemidiaAdsSettings.rewardPerClick = rewardPerClick;
            await bemidiaAdsSettings.save();
          }
          return {
            success: true,
            message: "Successfully updated BeMidia ads settings",
          };
        } catch (error) {
          console.log("Error updating bemidia ads settings", error);
          return {
            success: false,
            message: "Failed to update BeMidia ads settings",
          };
        }
      }
    ),
  },
};
