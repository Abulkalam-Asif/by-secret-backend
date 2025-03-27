import { RouletteSettings } from "../../models/RouletteSettings";

export const rouletteSettingsResolver = {
  Query: {
    getRouletteSettings: async () => {
      try {
        const rouletteSettings = await RouletteSettings.findOne();
        return rouletteSettings;
      } catch (error) {
        console.log("Error getting roulette settings", error);
        return null;
      }
    },
  },
  Mutation: {
    updateRouletteSettings: async (
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
        const rouletteSettings = await RouletteSettings.findOne();
        if (!rouletteSettings) {
          await RouletteSettings.create({
            costPerView,
            costPerClick,
            rewardPerView,
            rewardPerClick,
          });
        } else {
          rouletteSettings.costPerView = costPerView;
          rouletteSettings.costPerClick = costPerClick;
          rouletteSettings.rewardPerView = rewardPerView;
          rouletteSettings.rewardPerClick = rewardPerClick;
          await rouletteSettings.save();
        }
        return {
          success: true,
          message: "Successfully updated roulette settings",
        };
      } catch (error) {
        console.log("Error updating roulette settings", error);
        return {
          success: false,
          message: "Failed to update roulette settings",
        };
      }
    },
  },
};
