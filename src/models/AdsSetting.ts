import mongoose, { Schema } from "mongoose";

const AdsSettingSchema: Schema = new Schema({
  costPerView: {
    type: Number,
    required: true,
  },
  costPerClick: {
    type: Number,
    required: true,
  },
  rewardPerView: {
    type: Number,
    required: true,
  },
  rewardPerClick: {
    type: Number,
    required: true,
  },
});

export const AdsSetting = mongoose.model("AdsSetting", AdsSettingSchema);
