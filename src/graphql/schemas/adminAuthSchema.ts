import { gql } from "apollo-server-express";

export const adminAuthTypeDefs = gql`
  type Admin {
    id: ID!
    fullName: String!
    username: String!
    password: String!
    isActive: Boolean!
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type AdminBasicInfo {
    fullName: String!
    username: String!
    isActive: Boolean!
  }

  type Query {
    getAllAdmins: [AdminBasicInfo]
  }

  type Mutation {
    loginAdmin(username: String!, password: String!): MutationResponse
    createAdmin(
      fullName: String!
      username: String!
      password: String!
      isActive: Boolean!
    ): MutationResponse
    verifyToken(token: String!): Boolean
  }
`;
