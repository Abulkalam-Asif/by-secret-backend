import { RouletteSetting } from "../../models/RouletteSetting";

export const rouletteSettingResolver = {
  Query: {
    getRouletteSetting: async () => {
      try {
        const rouletteSetting = await RouletteSetting.findOne();
        return rouletteSetting;
      } catch (error) {
        console.log("Error getting roulette setting", error);
        return null;
      }
    },
  },
  Mutation: {
    updateRouletteSetting: async (
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
        const rouletteSetting = await RouletteSetting.findOne();
        if (!rouletteSetting) {
          await RouletteSetting.create({
            costPerView,
            costPerClick,
            rewardPerView,
            rewardPerClick,
          });
        } else {
          rouletteSetting.costPerView = costPerView;
          rouletteSetting.costPerClick = costPerClick;
          rouletteSetting.rewardPerView = rewardPerView;
          rouletteSetting.rewardPerClick = rewardPerClick;
          await rouletteSetting.save();
        }
        return {
          success: true,
          message: "Successfully updated roulette setting",
        };
      } catch (error) {
        console.log("Error updating roulette setting", error);
        return {
          success: false,
          message: "Failed to update roulette setting",
        };
      }
    },
  },
};
