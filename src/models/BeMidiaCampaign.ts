import mongoose, { Schema } from "mongoose";

const BeMidiaCampaignSchema: Schema = new Schema(
  {
    advertiser: {
      type: Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    name: { type: String, required: true },
    adImage: { type: String, required: true }, // URL to the ad image stored in Cloudinary
    action: { type: String, required: true }, // URL for the action
    startDate: { type: Date, required: true },
    startHour: { type: String, required: true }, // Format: "HH:MM"
    endDate: { type: Date, required: true },
    endHour: { type: String, required: true }, // Format: "HH:MM"
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED"],
      default: "PENDING",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to get invoices for this campaign
BeMidiaCampaignSchema.virtual("invoices", {
  ref: "Invoice",
  localField: "_id",
  foreignField: "campaign",
  match: { campaignType: "BeMidiaCampaign" },
});

export const BeMidiaCampaign = mongoose.model("BeMidiaCampaign", BeMidiaCampaignSchema);
