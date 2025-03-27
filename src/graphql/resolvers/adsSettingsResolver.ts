import { AdsSettings } from "../../models/AdsSettings";

export const adsSettingsResolver = {
  Query: {
    getAdsSettings: async () => {
      try {
        const adsSettings = await AdsSettings.findOne();
        return adsSettings;
      } catch (error) {
        console.log("Error getting ads settings", error);
        return null;
      }
    },
  },
  Mutation: {
    updateAdsSettings: async (
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
        const adsSettings = await AdsSettings.findOne();
        if (!adsSettings) {
          await AdsSettings.create({
            costPerView,
            costPerClick,
            rewardPerView,
            rewardPerClick,
          });
        } else {
          adsSettings.costPerView = costPerView;
          adsSettings.costPerClick = costPerClick;
          adsSettings.rewardPerView = rewardPerView;
          adsSettings.rewardPerClick = rewardPerClick;
          await adsSettings.save();
        }
        return {
          success: true,
          message: "Successfully updated ads settings",
        };
      } catch (error) {
        console.log("Error updating ads settings", error);
        return {
          success: false,
          message: "Failed to update ads settings",
        };
      }
    },
  },
};
