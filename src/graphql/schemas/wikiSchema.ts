import { gql } from "apollo-server-express";

export const wikiTypeDefs = gql`
  type Wiki {
    id: ID!
    content: String!
    updatedAt: String!
  }

  type MutationResponse {
    success: Boolean!
    message: String
  }

  type Query {
    getWiki: Wiki
  }

  type Mutation {
    updateWiki(content: String!): MutationResponse!
  }
`;
