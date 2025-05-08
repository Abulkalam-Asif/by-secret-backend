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
    rejectionReason: String
  }

  type PendingAdsCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateRequested: String!
    days: String!
    startDate: String!
    budget: String!
    media: String!
    action: String!
  }

  type ApprovedAdsCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateCreated: String!
    startDate: String!
    endDate: String!
    budget: String!
  }

  type RejectedAdsCampaign  {
    id: ID!
    name: String!
    advertiser: String!
    dateRequested: String!
    days: String!
    startDate: String!
    budget: String!
    media: String!
    action: String!
    rejectionReason: String!
  }

  type AdsCampaignCount {
    pending: Int!
    approved: Int!
    rejected: Int!
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type Query {
    getAdsCampaigns: [AdsCampaign!]!
    getAdsCampaignsCount: AdsCampaignCount!
    getAllAdsCampaignsCount: AdsCampaignCount!
    getPendingAdsCampaigns: [PendingAdsCampaign!]!
    getApprovedAdsCampaigns: [ApprovedAdsCampaign!]!
    getRejectedAdsCampaigns: [RejectedAdsCampaign!]!
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
    approveAdsCampaign(id: ID!): MutationResponse!
    rejectAdsCampaign(id: ID!, rejectionReason: String!): MutationResponse!
  }
`;
