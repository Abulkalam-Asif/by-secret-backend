export const campaignsCountTypeDefs = `
   type CampaignsCount {
    pending: Int!
    approved: Int!
    rejected: Int!
  }

   type Query {
    getAdsCampaignsCount: CampaignsCount!
    getAllAdsCampaignsCount: CampaignsCount!
    getRouletteCampaignsCount: CampaignsCount!
    getAllRouletteCampaignsCount: CampaignsCount!
    getCampaignsCount: CampaignsCount!
    getAllCampaignsCount: CampaignsCount!
  }

  type Mutation {
    _: String
  }
`;
