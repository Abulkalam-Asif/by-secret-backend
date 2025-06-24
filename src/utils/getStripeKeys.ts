import { AdminGeneralSettings } from "../models/AdminGeneralSettings";

export type StripeKeys = {
  stripePublishableKey: string;
  stripeSecretKey: string;
};

export const getStripeKeys = async (): Promise<StripeKeys | null> => {
  try {
    const settings = await AdminGeneralSettings.findOne();
    if (!settings) {
      return null;
    }
    if (!settings.stripePublishableKey || !settings.stripeSecretKey) {
      return null;
    }
    return {
      stripePublishableKey: settings.stripePublishableKey as string,
      stripeSecretKey: settings.stripeSecretKey as string,
    };
  } catch (error) {
    console.error("Error fetching Stripe keys:", error);
    return null;
  }
};
