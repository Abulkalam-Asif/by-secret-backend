export const adsCampaignTypeDefs = `
  type AdsCampaign {
    id: ID!
    name: String!
    adImage: String!
    action: String!
    startDate: String!
    endDate: String!
    budget: String!
    status: String!
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type Query {
    getAdsCampaigns: [AdsCampaign!]!
    getAdsCampaign(id: ID!): AdsCampaign
  }

  type Mutation {
    createAdsCampaign(
      name: String!
      adImage: String!
      action: String!
      startDate: String!
      endDate: String!
      budget: String!
    ): MutationResponse!

    updateAdsCampaign(
      id: ID!
      name: String
      adImage: String
      action: String
      startDate: String
      endDate: String
      budget: String
    ): MutationResponse!

    deleteAdsCampaign(id: ID!): Boolean!
  }
`;
