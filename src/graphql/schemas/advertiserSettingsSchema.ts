import { gql } from "apollo-server-express";

export const advertiserSettingsTypeDefs = gql`
  type AdvertiserSettings {
    companyName: String!
    fullContactName: String!
    phone: String!
    address: String!
    logo: String
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    getAdvertiserSettings: AdvertiserSettings
  }

  type Mutation {
    updateAdvertiserSettings(
      companyName: String!
      fullContactName: String!
      phone: String!
      address: String!
      logo: String!
    ): MutationResponse!

    changeAdvertiserPassword(
      currentPassword: String!
      newPassword: String!
    ): MutationResponse!
  }
`;
