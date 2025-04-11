import { gql } from "apollo-server-express";

export const advertiserTypeDefs = gql`
  type Advertiser {
    companyName: String!
    fullContactName: String!
    email: String!
    password: String
    phone: String
    address: String
    logo: String
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  extend type Query {
    _empty: String
  }

  type Mutation {
    submitAdvertiserStep1(
      companyName: String!
      fullContactName: String!
      email: String!
    ): MutationResponse!

    submitAdvertiserStep3(
      password: String!
      phone: String!
      address: String!
      logo: String!
      token: String!
    ): MutationResponse!

    loginAdvertiser(email: String!, password: String!): MutationResponse!
  }
`;
