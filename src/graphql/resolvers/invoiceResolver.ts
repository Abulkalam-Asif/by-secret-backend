import { AuthContext } from "../../middleware/authMiddleware";
import {
  requireAdmin,
  requireAdvertiser,
} from "../../middleware/resolverMiddleware";
import { Invoice } from "../../models/Invoice";
import Stripe from "stripe";
import { getStripeKeys } from "../../utils/getStripeKeys";

export const invoiceResolver = {
  Query: {
    getInvoicesForAdmin: requireAdmin(async (_: any, __: any) => {
      try {
        const populatedInvoices = await (Invoice as any).findWithPopulation(); // Transform the data to match the GraphQL schema
        return populatedInvoices.map((invoice: any) => ({
          id: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          advertiser: invoice.advertiser?.companyName || "Unknown",
          campaign: invoice.campaign?.name || "Unknown",
          date: invoice.date?.toISOString() || null,
          amount: invoice.amount,
          paymentDate: invoice.paymentDate?.toISOString() || null,
          reference: invoice.reference,
          paymentMethod: invoice.paymentMethod,
          status: invoice.status,
        }));
      } catch (error) {
        console.log("Error getting invoices for admin", error);
        return null;
      }
    }),
    getInvoicesForAdvertiser: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const advertiserId = context.user?._id;
          if (!advertiserId) {
            throw new Error("Advertiser ID not found in context");
          }
          const populatedInvoices = await (Invoice as any).findWithPopulation();
          return populatedInvoices
            .filter(
              (invoice: any) =>
                invoice.advertiser?._id.toString() === advertiserId.toString()
            )
            .map((invoice: any) => ({
              id: invoice._id,
              invoiceNumber: invoice.invoiceNumber,
              campaign: invoice.campaign?.name || "Unknown",
              date: invoice.date?.toISOString() || null,
              amount: invoice.amount,
              paymentDate: invoice.paymentDate?.toISOString() || null,
              reference: invoice.reference,
              paymentMethod: invoice.paymentMethod,
              status: invoice.status,
            }));
        } catch (error) {
          console.log("Error getting invoices for advertiser", error);
          return null;
        }
      }
    ),
  },
  Mutation: {
    payInvoice: requireAdvertiser(
      async (
        _: any,
        {
          invoiceId,
          paymentMethodId,
        }: { invoiceId: string; paymentMethodId: string },
        context: AuthContext
      ) => {
        try {
          // Find the invoice
          const invoice = await Invoice.findById(invoiceId);
          if (!invoice) {
            return {
              success: false,
              message: "Invoice not found",
            };
          }

          // Check if invoice belongs to the current advertiser
          const invoiceAdvertiserId = invoice.advertiser as unknown as string;
          if (invoiceAdvertiserId.toString() !== context.user?._id.toString()) {
            return {
              success: false,
              message: "You are not authorized to pay this invoice",
            };
          }

          // Check if invoice is already paid
          if (invoice.status === "PAID") {
            return {
              success: false,
              message: "This invoice has already been paid",
            };
          } // Process payment with Stripe
          const amount = invoice.amount as number;
          const amountInCents = Math.round(amount * 100); // Convert to cents

          // Initialize Stripe with the secret key from environment variables
          const stripeKeys = await getStripeKeys();
          if (!stripeKeys) {
            console.error("Stripe keys not found in settings");
            return {
              success: false,
              message: "An error occurred. Please try again later.",
            };
          }

          const stripe = new Stripe(stripeKeys.stripeSecretKey);

          try {
            // Create a payment intent
            const paymentIntent = await stripe.paymentIntents.create({
              amount: amountInCents,
              currency: "usd",
              payment_method: paymentMethodId,
              confirm: true,
              description: `Invoice ${invoice.invoiceNumber} payment`,
              automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
              },
              metadata: {
                invoiceId: invoiceId,
                invoiceNumber: String(invoice.invoiceNumber),
              },
            });

            // Check if payment was successful
            if (paymentIntent.status === "succeeded") {
              // Update invoice status to paid
              invoice.status = "PAID";
              invoice.paymentDate = new Date();
              invoice.paymentMethod = "Credit Card";
              invoice.reference = paymentIntent.id;
              await invoice.save();

              return {
                success: true,
                message: "Payment successful",
              };
            } else {
              return {
                success: false,
                message: "Payment processing failed",
              };
            }
          } catch (stripeError: any) {
            console.error("Stripe payment error:", stripeError);
            return {
              success: false,
              message: stripeError.message || "Payment processing failed",
            };
          }
        } catch (error: any) {
          console.error("Invoice payment error:", error);
          return {
            success: false,
            message:
              error.message || "An error occurred during payment processing",
          };
        }
      }
    ),
  },
};
