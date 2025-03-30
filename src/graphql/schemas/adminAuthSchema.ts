import { gql } from "apollo-server-express";

export const adminAuthTypeDefs = gql`
  type Admin {
    id: ID!
    fullName: String!
    email: String!
    password: String!
    isActive: Boolean!
  }

  type MutationResponse {
    success: Boolean
    message: String
  }

  type AdminBasicInfo {
    fullName: String!
    email: String!
    isActive: Boolean!
  }

  type Query {
    getAllAdmins: [AdminBasicInfo]
  }

  type Mutation {
    loginAdmin(email: String!, password: String!): MutationResponse
    createAdmin(
      fullName: String!
      email: String!
      password: String!
      isActive: Boolean!
    ): MutationResponse
    verifyToken(token: String!): Boolean
  }
`;
