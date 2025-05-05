import { gql } from "apollo-server-express";

export const advertiserAuthTypeDefs = gql`
  type Advertiser {
    id: ID!
    companyName: String!
    fullContactName: String!
    email: String!
    password: String
    phone: String
    address: String
    logo: String
  }

  type AdvertiserData {
    id: ID!
    companyName: String!
    logo: String
    fullContactName: String!
    phone: String
    email: String!
    address: String
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type AdvertiserAuth {
    email: String!
  }

  type Query {
    authorizeAdvertiser: AdvertiserAuth
    getAdvertisersCount: Int
    getAdvertisers: [AdvertiserData!]!
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

    logoutAdvertiser: MutationResponse!
  }
`;
