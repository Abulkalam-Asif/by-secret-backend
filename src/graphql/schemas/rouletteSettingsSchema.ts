import { gql } from "apollo-server-express";

export const rouletteSettingsTypeDefs = gql`
  type RouletteSettings {
    id: ID!
    costPerView: Float!
    costPerClick: Float!
    neoDollarsCost: Float!
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type Query {
    getRouletteSettings: RouletteSettings
  }

  type Mutation {
    updateRouletteSettings(
      costPerView: Float
      costPerClick: Float
      neoDollarsCost: Float
    ): MutationResponse
  }
`;
