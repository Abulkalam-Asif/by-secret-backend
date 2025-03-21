import mongoose, { Schema } from "mongoose";

const WikiSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

export const Wiki = mongoose.model("Wiki", WikiSchema);
