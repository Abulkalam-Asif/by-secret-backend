import { signJwt } from "../../utils/signJwt";
import { verifyJwt } from "../../utils/verifyJwt";
import { Admin, IAdmin } from "../../models/Admin";
import { Response } from "express";
import {
  createAdminValidation,
  loginAdminValidation,
} from "../../validations/adminAuthValidations";
import { requireAdmin } from "../../middleware/resolverMiddleware";
import { AuthContext } from "../../middleware/authMiddleware";

export const adminAuthResolver = {
  Query: {
    // Protected query - only admins can access
    getAllAdmins: requireAdmin(async () => {
      try {
        const admins = await Admin.find();
        return admins.map((admin: IAdmin) => ({
          fullName: admin.fullName,
          email: admin.email,
          isActive: admin.isActive,
        }));
      } catch (error) {
        console.log("Error fetching admins", error);
        return null;
      }
    }),

    authorizeAdmin: async (_: any, __: any, context: AuthContext) => {
      const { req, res } = context;
      const authToken = req.cookies?.authToken;

      if (!authToken) {
        return {
          email: null,
        };
      }

      try {
        const decoded = await verifyJwt(authToken);
        if (!decoded) {
          return {
            email: null,
          };
        }

        // Check if admin exists
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) {
          return {
            email: null,
          };
        }

        return {
          email: admin.email,
        };
      } catch (error) {
        console.log("Error authorizing admin", error);
        return {
          email: null,
        };
      }
    },
  },
  Mutation: {
    loginAdmin: async (
      _: any,
      { email, password }: { email: string; password: string },
      context: AuthContext
    ) => {
      const loginError = loginAdminValidation(email, password);
      if (loginError) {
        return {
          success: false,
          message: loginError,
        };
      }

      const { res }: { res: Response } = context;

      try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        // Check if admin is active
        if (!admin.isActive) {
          return {
            success: false,
            message: "Admin is inactive",
          };
        }

        // Check if password is correct
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        // Sign JWT
        const authToken = await signJwt(email);

        // Get the frontend URL for CORS settings
        const frontendUrl = process.env.FRONTEND_URL as string;

        // Check if we're using HTTPS in production
        const isSecure = frontendUrl.startsWith("https://");

        // Extract domain for cookie settings
        let domain;
        try {
          // Extract domain from frontend URL if it's not localhost
          const urlObj = new URL(frontendUrl);
          domain =
            urlObj.hostname !== "localhost" ? urlObj.hostname : undefined;
        } catch (e) {
          console.log("Error parsing frontend URL", e);
        }

        // Return authToken
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Origin", frontendUrl);
        res.cookie("authToken", authToken, {
          httpOnly: true,
          secure: isSecure, // Only use secure if using HTTPS
          sameSite: "lax",
          maxAge: 3600000,
          domain: domain, // Set domain for cross-domain cookies if needed
          path: "/",
        });

        return {
          success: true,
          message: "Successfully logged in",
        };
      } catch (error) {
        console.log("Error logging in", error);
        return {
          success: false,
          message: "An error occurred while logging in",
        };
      }
    },
    logoutAdmin: async (_: any, __: any, context: AuthContext) => {
      const { res }: { res: Response } = context;

      try {
        // Get the frontend URL for CORS settings
        const frontendUrl = process.env.FRONTEND_URL as string;

        // Extract domain for cookie settings
        let domain;
        try {
          // Extract domain from frontend URL if it's not localhost
          const urlObj = new URL(frontendUrl);
          domain =
            urlObj.hostname !== "localhost" ? urlObj.hostname : undefined;
        } catch (e) {
          console.log("Error parsing frontend URL", e);
        }

        // Clear the auth cookie
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Origin", frontendUrl);
        res.clearCookie("authToken", {
          httpOnly: true,
          secure: frontendUrl.startsWith("https://"),
          sameSite: "lax",
          path: "/",
          domain: domain,
        });

        return {
          success: true,
          message: "Successfully logged out",
        };
      } catch (error) {
        console.log("Error logging out", error);
        return {
          success: false,
          message: "An error occurred while logging out",
        };
      }
    },
    // Protected mutation
    createAdmin: requireAdmin(
      async (
        _: any,
        {
          email,
          password,
          fullName,
          isActive,
        }: {
          email: string;
          password: string;
          fullName: string;
          isActive: boolean;
        }
      ) => {
        const createAdminError = createAdminValidation(
          fullName,
          email,
          password
        );

        if (createAdminError) {
          return {
            success: false,
            message: createAdminError,
          };
        }

        try {
          // Checking if admin already exists
          const existingAdmin = await Admin.findOne({ email });
          if (existingAdmin) {
            return {
              success: false,
              message: "An admin with this email already exists",
            };
          }

          // Creating new admin
          const admin = new Admin({
            email,
            password,
            fullName,
            isActive,
          });
          await admin.save();

          return {
            success: true,
            message: "Admin created successfully",
          };
        } catch (error) {
          console.log("Error creating admin", error);
          return {
            success: false,
            message: "An error occurred while creating admin",
          };
        }
      }
    ),
    // Protected mutation
    changeAdminStatus: requireAdmin(
      async (_: any, { email }: { email: string }, context: AuthContext) => {
        // Check if the requesting admin is admin@admin.com
        if (context.user?.email !== "admin@admin.com") {
          return {
            success: false,
            message: "Only the super admin can change admin status",
          };
        }

        // Prevent changing the super admin's own status
        if (email === "admin@admin.com") {
          return {
            success: false,
            message: "Cannot change the status of the super admin",
          };
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
          return {
            success: false,
            message: "Admin not found",
          };
        }
        try {
          // Toggle admin status
          admin.isActive = !admin.isActive;
          await admin.save();

          return {
            success: true,
            message: `Admin status changed to ${
              admin.isActive ? "active" : "inactive"
            }`,
          };
        } catch (error) {
          console.log("Error changing admin status", error);
          return {
            success: false,
            message: "An error occurred while changing admin status",
          };
        }
      }
    ),
    // Protected mutation
    changeAdminPassword: requireAdmin(
      async (
        _: any,
        { email, newPassword }: { email: string; newPassword: string },
        context: AuthContext
      ) => {
        // Check if the requesting admin is admin@admin.com
        if (context.user?.email !== "admin@admin.com") {
          return {
            success: false,
            message: "Only the super admin can change passwords",
          };
        }

        try {
          // Find admin by email
          const admin = await Admin.findOne({ email });
          if (!admin) {
            return {
              success: false,
              message: "Admin not found",
            };
          }

          // Validate password - assuming similar validation as in createAdmin
          // This should check for password complexity, length, etc.
          if (!newPassword || newPassword.length < 8) {
            return {
              success: false,
              message: "Password must be at least 8 characters long",
            };
          }

          // Update password
          admin.password = newPassword;
          await admin.save();

          return {
            success: true,
            message: "Password updated successfully",
          };
        } catch (error) {
          console.log("Error changing admin password", error);
          return {
            success: false,
            message: "An error occurred while changing admin password",
          };
        }
      }
    ),
  },
};
