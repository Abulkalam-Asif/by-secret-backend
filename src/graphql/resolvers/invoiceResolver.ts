import { requireAdmin } from "../../middleware/resolverMiddleware";
import { Invoice } from "../../models/Invoice";

export const invoiceResolver = {
  Query: {
    getInvoicesForAdmin: requireAdmin(async (_: any, __: any) => {
      try {
        const populatedInvoices = await (Invoice as any).findWithPopulation();        // Transform the data to match the GraphQL schema
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
  },
  Mutation: {},
};
