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
  neoDollarsCost: {
    type: Number,
    required: true,
  },
});

export const RouletteSettings = mongoose.model(
  "RouletteSettings",
  RouletteSettingSchema
);
