export const stripeKeyTypeDefs = `
  type StripeKey {
    stripeTestPublishableKey: String!
    stripeLivePublishableKey: String!
  }

  type Query {
    getStripeTestPublishableKey: String!
    getStripeLivePublishableKey: String!
  }
  
  type Mutation {
    _: String
  }
`;
