import { AdsSetting } from "../../models/AdsSetting";

export const adsSettingResolver = {
  Query: {
    getAdsSetting: async () => {
      try {
        const adsSetting = await AdsSetting.findOne();
        return adsSetting;
      } catch (error) {
        console.log("Error getting ads setting", error);
        return null;
      }
    },
  },
  Mutation: {
    updateAdsSetting: async (
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
        const adsSetting = await AdsSetting.findOne();
        if (!adsSetting) {
          await AdsSetting.create({
            costPerView,
            costPerClick,
            rewardPerView,
            rewardPerClick,
          });
        } else {
          adsSetting.costPerView = costPerView;
          adsSetting.costPerClick = costPerClick;
          adsSetting.rewardPerView = rewardPerView;
          adsSetting.rewardPerClick = rewardPerClick;
          await adsSetting.save();
        }
        return {
          success: true,
          message: "Successfully updated ads setting",
        };
      } catch (error) {
        console.log("Error updating ads setting", error);
        return {
          success: false,
          message: "Failed to update ads setting",
        };
      }
    },
  },
};
