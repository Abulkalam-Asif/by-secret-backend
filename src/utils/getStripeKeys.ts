import { AdminGeneralSettings } from "../models/AdminGeneralSettings";

export type StripeKeys = {
  stripeTestPublishableKey: string;
  stripeTestSecretKey: string;
  stripeLivePublishableKey: string;
  stripeLiveSecretKey: string;
};

export const getStripeKeys = async (): Promise<StripeKeys | null> => {
  try {
    const settings = await AdminGeneralSettings.findOne();
    if (!settings) {
      return null;
    }
    if (
      !settings.stripeTestPublishableKey ||
      !settings.stripeTestSecretKey ||
      !settings.stripeLivePublishableKey ||
      !settings.stripeLiveSecretKey
    ) {
      return null;
    }
    return {
      stripeTestPublishableKey: settings.stripeTestPublishableKey as string,
      stripeTestSecretKey: settings.stripeTestSecretKey as string,
      stripeLivePublishableKey: settings.stripeLivePublishableKey as string,
      stripeLiveSecretKey: settings.stripeLiveSecretKey as string,
    };
  } catch (error) {
    console.error("Error fetching Stripe keys:", error);
    return null;
  }
};
