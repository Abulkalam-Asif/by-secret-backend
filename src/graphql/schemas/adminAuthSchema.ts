import { gql } from "graphql-tag";

export const adminTypeDefs = gql`
  type Admin {
    id: ID!
    username: String!
    password: String!
  }

  type MutationResponse {
    success: Boolean
    message: String
    token: String
  }

  type Query {
    _empty: String
  }

  type Mutation {
    loginAdmin(username: String!, password: String!): MutationResponse
    verifyToken(token: String!): Boolean
  }
`;

// tempCreateAdmin(username: String!, password: String!): Admin
