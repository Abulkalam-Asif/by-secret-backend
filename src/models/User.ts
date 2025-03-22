import { Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const User = mongoose.model("User", UserSchema);
