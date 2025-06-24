import { gql } from "apollo-server-express";

export const generalSettingsTypeDefs = gql`
  type AdminGeneralSettings {
    companyName: String
    logo: String
    phone: String
    email: String
    address: String
    city: String
    state: String
    country: String
    zipCode: String
    stripePublishableKey: String
    stripeSecretKey: String
    googleMapsApiKey: String
    oneLoginPublishableKey: String
    oneLoginPrivateKey: String
    smtpHost: String
    smtpPort: String
    smtpUsername: String
    smtpPassword: String
    smtpFromEmail: String
    smtpFromName: String
    termsAndConditions: String
    privacyPolicy: String
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    getAdminGeneralSettings: AdminGeneralSettings
  }

  type Mutation {
    updateAdminGeneralSettings(
      companyName: String
      logo: String
      phone: String
      email: String
      address: String
      city: String
      state: String
      country: String
      zipCode: String
      stripePublishableKey: String
      stripeSecretKey: String
      googleMapsApiKey: String
      oneLoginPublishableKey: String
      oneLoginPrivateKey: String
      smtpHost: String
      smtpPort: String
      smtpUsername: String
      smtpPassword: String
      smtpFromEmail: String
      smtpFromName: String
      termsAndConditions: String
      privacyPolicy: String
    ): MutationResponse!
  }
`;
