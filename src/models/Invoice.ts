import mongoose, { Schema } from "mongoose";

// Counter schema for invoice numbering
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 5020 }, // Starting from 5020 as requested
});

const Counter = mongoose.model("Counter", CounterSchema);

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: {
    type: String,
    unique: true,
  },
  advertiser: {
    type: Schema.Types.ObjectId,
    ref: "Advertiser",
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    refPath: "campaignType",
    required: true,
  },
  campaignType: {
    type: String,
    enum: ["AdsCampaign", "RouletteCampaign"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: false,
  },
  reference: {
    type: String,
    required: false,
  },
  paymentMethod: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["PAID", "PENDING"],
    default: "PENDING",
    required: true,
  },
});

// Pre-save hook to generate invoice number
InvoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    try {
      const currentYear = new Date().getFullYear();
      const counter = await Counter.findByIdAndUpdate(
        "invoice_counter",
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      const paddedNumber = counter.sequence_value.toString().padStart(8, "0");
      this.invoiceNumber = `EP-${currentYear}-${paddedNumber}`;
      next();
    } catch (error: any) {
      console.error("Error generating invoice number:", error);
      next(error);
    }
  } else {
    next();
  }
});

// Static method to get invoices with proper population
InvoiceSchema.statics.findWithPopulation = async function () {
  const { AdsCampaign } = require("./AdsCampaign");
  const { RouletteCampaign } = require("./RouletteCampaign");
  // Get invoices with advertiser populated
  const invoices = await this.find()
    .populate("advertiser", "companyName")
    .select(
      "_id invoiceNumber campaign campaignType date amount paymentDate reference paymentMethod status"
    )
    .lean();

  // Manually populate campaign data based on campaignType
  const populatedInvoices = await Promise.all(
    invoices.map(async (invoice: any) => {
      let campaignData = null;

      if (invoice.campaignType === "AdsCampaign") {
        campaignData = await AdsCampaign.findById(invoice.campaign)
          .select("name")
          .lean();
      } else if (invoice.campaignType === "RouletteCampaign") {
        campaignData = await RouletteCampaign.findById(invoice.campaign)
          .select("name")
          .lean();
      }

      return {
        ...invoice,
        advertiser: invoice.advertiser,
        campaign: campaignData,
      };
    })
  );

  return populatedInvoices;
};

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
