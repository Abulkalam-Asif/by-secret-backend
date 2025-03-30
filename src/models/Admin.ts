import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants";

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters long"],
      maxlength: [50, "Full name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [EMAIL_REGEX, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [
        PASSWORD_REGEX,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

AdminSchema.pre<IAdmin>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
