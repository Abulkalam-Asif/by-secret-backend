import mongoose, { Schema } from "mongoose";

const RouletteSettingSchema: Schema = new Schema({
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

export const RouletteSetting = mongoose.model(
  "RouletteSetting",
  RouletteSettingSchema
);
