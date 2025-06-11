import { gql } from "apollo-server-express";

export const invoiceTypeDefs = gql`  type Invoice {
    id: ID
    invoiceNumber: String
    advertiser: String
    campaign: String
    campaignType: String
    date: String
    amount: Float
    status: String
    paymentDate: String
    reference: String
    paymentMethod: String
  }

  type Query {
    getInvoicesForAdmin: [Invoice]
    getInvoicesForAdvertiser: [Invoice]
  }

  type Mutation {
    _: String
  }
`;
