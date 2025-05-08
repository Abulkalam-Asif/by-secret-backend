export const rouletteCampaignTypeDefs = `
  type RouletteCampaign {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
    mainPrize: String!
    mainPrizeAmount: String!
    secPrize1: String
    amount1: String
    secPrize2: String
    amount2: String
    secPrize3: String
    amount3: String
    budget: String!
    status: String!
    rejectionReason: String
  }

  type PendingRouletteCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateRequested: String!
    days: String!
    startDate: String!
    mainPrize: String!
    mainPrizeAmount: String!
    secPrize1: String
    amount1: String
    secPrize2: String
    amount2: String
    secPrize3: String
    amount3: String
    budget: String!
  }

  type ApprovedRouletteCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateCreated: String!
    startDate: String!
    endDate: String!
    mainPrize: String!
    mainPrizeAmount: String!
    secPrize1: String
    amount1: String
    secPrize2: String
    amount2: String
    secPrize3: String
    amount3: String
    budget: String!
  }

  type RejectedRouletteCampaign {
    id: ID!
    name: String!
    advertiser: String!
    dateRequested: String!
    days: String!
    startDate: String!
    mainPrize: String!
    mainPrizeAmount: String!
    secPrize1: String
    amount1: String
    secPrize2: String
    amount2: String
    secPrize3: String
    amount3: String
    budget: String!
    rejectionReason: String!
  }

  type RouletteCampaignCount {
    pending: Int!
    approved: Int!
    rejected: Int!
  }

  type Query {
    getRouletteCampaigns: [RouletteCampaign!]!
    getRouletteCampaignsCount: RouletteCampaignCount!
    getAllRouletteCampaignsCount: RouletteCampaignCount!
    getPendingRouletteCampaigns: [PendingRouletteCampaign!]!
    getApprovedRouletteCampaigns: [ApprovedRouletteCampaign!]!
    getRejectedRouletteCampaigns: [RejectedRouletteCampaign!]!
  }

  type Mutation {
    createRouletteCampaign(
      name: String!
      startDate: String!
      endDate: String!
      mainPrize: String!
      mainPrizeAmount: String!
      secPrize1: String
      amount1: String
      secPrize2: String
      amount2: String
      secPrize3: String
      amount3: String
      budget: String!
    ): MutationResponse!

    updateRouletteCampaign(
      id: ID!
      name: String
      startDate: String
      endDate: String
      mainPrize: String
      mainPrizeAmount: String
      secPrize1: String
      amount1: String
      secPrize2: String
      amount2: String
      secPrize3: String
      amount3: String
      budget: String
    ): MutationResponse!

    approveRouletteCampaign(id: ID!): MutationResponse!
    rejectRouletteCampaign(id: ID!, rejectionReason: String!): MutationResponse!
  }
`; 