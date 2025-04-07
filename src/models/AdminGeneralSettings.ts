import mongoose, { Schema } from "mongoose";

const AdminGeneralSettingsSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  logo: { type: String, required: false },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  stripePublishableKey: { type: String, required: false },
  stripePrivateKey: { type: String, required: false },
  googleMapsApiKey: { type: String, required: false },
  oneLoginPublishableKey: { type: String, required: false },
  oneLoginPrivateKey: { type: String, required: false },
  smtpHost: { type: String, required: false },
  smtpPort: { type: String, required: false },
  smtpUsername: { type: String, required: false },
  smtpPassword: { type: String, required: false },
  smtpFromEmail: { type: String, required: false },
  smtpFromName: { type: String, required: false },
  termsAndConditions: { type: String, required: false },
  privacyPolicy: { type: String, required: false },
});

export const AdminGeneralSettings = mongoose.model("AdminGeneralSettings", AdminGeneralSettingsSchema);
