import { gql } from "apollo-server-express";

export const wikiTypeDefs = gql`
  type Wiki {
    id: ID!
    content: String!
  }

  type Query {
    getWiki: Wiki
  }

  type Mutation {
    updateWiki(content: String!): Wiki
  }
`;
