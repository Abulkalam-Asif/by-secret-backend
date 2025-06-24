import { getStripeKeys } from "../../utils/getStripeKeys";

export const stripeKeyResolver = {
  Query: {
    getStripeTestPublishableKey: async (_: any, _args: any) => {
      try {
        const stripeKeys = await getStripeKeys();
        if (!stripeKeys) {
          return null;
        }
        return stripeKeys.stripeTestPublishableKey;
      } catch (error) {
        console.error("Error getting Stripe test publishable key:", error);
        return null;
      }
    },
    getStripeLivePublishableKey: async (_: any, _args: any) => {
      try {
        const stripeKeys = await getStripeKeys();
        if (!stripeKeys) {
          return null;
        }
        return stripeKeys.stripeLivePublishableKey;
      } catch (error) {
        console.error("Error getting Stripe live publishable key:", error);
        return null;
      }
    },
  },
  Mutation: {},
};
