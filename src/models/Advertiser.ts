import mongoose, { Schema } from "mongoose";

const AdvertiserSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  fullContactName: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  password: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  logo: {
    type: String,
    required: false,
  },
});

export const Advertiser = mongoose.model("Advertiser", AdvertiserSchema);
