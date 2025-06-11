import mongoose, { Schema } from "mongoose";

const RouletteCampaignSchema: Schema = new Schema(
  {
    advertiser: {
      type: Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mainPrize: { type: String, required: true },
    mainPrizeAmount: { type: Number, required: true },
    secPrize1: { type: String },
    amount1: { type: Number },
    secPrize2: { type: String },
    amount2: { type: Number },
    secPrize3: { type: String },
    amount3: { type: Number },
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
RouletteCampaignSchema.virtual("invoices", {
  ref: "Invoice",
  localField: "_id",
  foreignField: "campaign",
  match: { campaignType: "RouletteCampaign" },
});

export const RouletteCampaign = mongoose.model(
  "RouletteCampaign",
  RouletteCampaignSchema
);
