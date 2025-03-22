import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    email: String!
    password: String!
    isActive: Boolean
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type Query {
    _empty: String
  }

  type Mutation {
    createUser(
      fullName: String!
      email: String!
      password: String!
      isActive: Boolean
    ): MutationResponse
  }
`;
