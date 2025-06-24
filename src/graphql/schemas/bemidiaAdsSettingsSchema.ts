import { gql } from "apollo-server-express";

export const bemidiaAdsSettingsTypeDefs = gql`
  type BeMidiaAdsSettings {
    id: ID!
    costPerView: Float!
    costPerClick: Float!
    rewardPerView: Float!
    rewardPerClick: Float!
  }

  type Query {
    getBemidiaAdsSettings: BeMidiaAdsSettings
  }

  type Mutation {
    updateBemidiaAdsSettings(
      costPerView: Float
      costPerClick: Float
      rewardPerView: Float
      rewardPerClick: Float
    ): MutationResponse
  }
`;
