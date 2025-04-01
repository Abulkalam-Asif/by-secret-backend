import { AuthContext } from "./authMiddleware";
import { GraphQLResolveInfo } from "graphql";

type Resolver = (
  parent: any,
  args: any,
  context: AuthContext,
  info: GraphQLResolveInfo
) => any;

// Protects resolvers that require admin authentication
export const requireAdmin = (resolver: Resolver): Resolver => {
  return async (parent, args, context, info) => {
    if (!context.user || context.user.role !== "admin") {
      throw new Error("Unauthorized. Admin access required.");
    }
    return resolver(parent, args, context, info);
  };
};

// For future use - protects resolvers that require advertiser authentication
export const requireAdvertiser = (resolver: Resolver): Resolver => {
  return async (parent, args, context, info) => {
    if (!context.user || context.user.role !== "advertiser") {
      throw new Error("Unauthorized. Advertiser access required.");
    }
    return resolver(parent, args, context, info);
  };
};

// Helper function for applying multiple middleware functions to a resolver
export const applyMiddleware = (
  resolver: Resolver,
  middlewares: Array<(resolver: Resolver) => Resolver>
): Resolver => {
  return middlewares.reduce(
    (result, middleware) => middleware(result),
    resolver
  );
};
