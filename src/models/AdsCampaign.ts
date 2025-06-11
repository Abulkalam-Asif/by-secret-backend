import mongoose, { Schema } from "mongoose";

const AdsCampaignSchema: Schema = new Schema(
  {
    advertiser: {
      type: Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    name: { type: String, required: true },
    adImage: { type: String, required: true }, // URL to the ad image stored in Cloudinary
    action: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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
AdsCampaignSchema.virtual("invoices", {
  ref: "Invoice",
  localField: "_id",
  foreignField: "campaign",
  match: { campaignType: "AdsCampaign" },
});

export const AdsCampaign = mongoose.model("AdsCampaign", AdsCampaignSchema);
