import { gql } from "apollo-server-express";

export const rouletteSettingTypeDefs = gql`
  type RouletteSetting {
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
    getRouletteSetting: RouletteSetting
  }

  type Mutation {
    updateRouletteSetting(
      costPerView: Float
      costPerClick: Float
      rewardPerView: Float
      rewardPerClick: Float
    ): MutationResponse
  }
`;
