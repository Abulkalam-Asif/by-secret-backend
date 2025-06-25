export const beMidiaCampaignTypeDefs = `
  type BeMidiaCampaign {
    id: ID!
    name: String!
    adImage: String!
    action: String!
    startDate: String!
    startHour: String!
    endDate: String!
    endHour: String!
    budget: String!
    status: String!
    rejectionReason: String
  }

  type PendingBeMidiaCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateRequested: String!
    days: String!
    startDate: String!
    startHour: String!
    endDate: String!
    endHour: String!
    budget: String!
    media: String!
    action: String!
  }

  type ApprovedBeMidiaCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateCreated: String!
    startDate: String!
    startHour: String!
    endDate: String!
    endHour: String!
    budget: String!
  }

  type RejectedBeMidiaCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateRequested: String!
    days: String!
    startDate: String!
    startHour: String!
    endDate: String!
    endHour: String!
    budget: String!
    media: String!
    action: String!
    rejectionReason: String!
  }

  extend type Query {
    getBeMidiaCampaigns: [BeMidiaCampaign!]!
    getPendingBeMidiaCampaigns: [PendingBeMidiaCampaign!]!
    getApprovedBeMidiaCampaigns: [ApprovedBeMidiaCampaign!]!
    getRejectedBeMidiaCampaigns: [RejectedBeMidiaCampaign!]!
  }

  extend type Mutation {
    createBeMidiaCampaign(
      name: String!
      adImage: String!
      action: String!
      startDate: String!
      startHour: String!
      endDate: String!
      endHour: String!
      budget: String!
    ): MutationResponse!

    updateBeMidiaCampaign(
      id: ID!
      name: String
      adImage: String
      action: String
      startDate: String
      startHour: String
      endDate: String
      endHour: String
      budget: String
    ): MutationResponse!
    
    approveBeMidiaCampaign(id: ID!): MutationResponse!
    rejectBeMidiaCampaign(id: ID!, rejectionReason: String!): MutationResponse!
  }
`;
