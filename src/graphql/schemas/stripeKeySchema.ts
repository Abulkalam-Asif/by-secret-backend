export const stripeKeyTypeDefs = `
  type StripeKey {
    stripePublishableKey: String!
  }

  type Query {
    getStripePublishableKey: String!
  }
  
  type Mutation {
    _: String
  }
`;
