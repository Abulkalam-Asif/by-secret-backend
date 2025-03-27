import { gql } from "apollo-server-express";

export const adsSettingsTypeDefs = gql`
  type AdsSettings {
    id: ID!
    costPerView: Float!
    costPerClick: Float!
    rewardPerView: Float!
    rewardPerClick: Float!
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type Query {
    getAdsSettings: AdsSettings
  }

  type Mutation {
    updateAdsSettings(
      costPerView: Float
      costPerClick: Float
      rewardPerView: Float
      rewardPerClick: Float
    ): MutationResponse
  }
`;
