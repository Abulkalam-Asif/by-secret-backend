import { Request, Response } from "express";
import { verifyJwt } from "../utils/verifyJwt";
import { Admin } from "../models/Admin";

export interface AuthContext {
  req: Request;
  res: Response;
  user?: {
    email: string;
    role: "admin" | "advertiser" | "public";
  };
}

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<AuthContext> => {
  // Default context has request and response
  const context: AuthContext = { req, res };

  // Get auth token from cookies
  const authToken = req.cookies?.authToken;

  // If no token, return the basic context (unauthorized)
  if (!authToken) {
    return context;
  }

  try {
    // Verify the token
    const decoded = await verifyJwt(authToken);
    if (!decoded || !decoded.email) {
      return context;
    }

    // Check if user is an admin
    const admin = await Admin.findOne({ email: decoded.email });
    if (admin && admin.isActive) {
      context.user = {
        email: admin.email,
        role: "admin",
      };
    }

    // Note: Later we can add advertiser role check here

    return context;
  } catch (error) {
    console.log("Authentication error:", error);
    return context;
  }
};
