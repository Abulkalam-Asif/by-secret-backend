import { Request, Response } from "express";
import { verifyJwt } from "../utils/verifyJwt";
import { Admin } from "../models/Admin";
import { Advertiser } from "../models/Advertiser";

export interface AuthContext {
  req: Request;
  res: Response;
  user?: {
    _id: string;
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
        _id: (admin._id as string).toString(),
        email: admin.email,
        role: "admin",
      };
    }

    // If not an admin, check if user is an advertiser
    if (!context.user) {
      const advertiser = await Advertiser.findOne({
        email: decoded.email,
      });
      if (advertiser) {
        context.user = {
          _id: advertiser._id.toString(),
          email: advertiser.email,
          role: "advertiser",
        };
      }
    }

    return context;
  } catch (error) {
    console.log("Authentication error:", error);
    return context;
  }
};
