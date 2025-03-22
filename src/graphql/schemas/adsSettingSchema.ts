import { gql } from "apollo-server-express";

export const adsSettingTypeDefs = gql`
  type AdsSetting {
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
    getAdsSetting: AdsSetting
  }

  type Mutation {
    updateAdsSetting(
      costPerView: Float
      costPerClick: Float
      rewardPerView: Float
      rewardPerClick: Float
    ): MutationResponse
  }
`;
