import { getStripeKeys } from "../../utils/getStripeKeys";

export const stripeKeyResolver = {
  Query: {
    getStripePublishableKey: async (_: any, _args: any) => {
      try {
        const stripeKeys = await getStripeKeys();
        if (!stripeKeys) {
          return null;
        }
        return stripeKeys.stripePublishableKey;
      } catch (error) {
        console.error("Error getting Stripe publishable key:", error);
        return null;
      }
    },
  },
  Mutation: {},
};
