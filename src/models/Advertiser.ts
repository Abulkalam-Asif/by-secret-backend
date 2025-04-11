import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdvertiser extends Document {
  companyName: string;
  fullContactName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  logo: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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

AdvertiserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Advertiser = mongoose.model<IAdvertiser>(
  "Advertiser",
  AdvertiserSchema
);
