import { signJwt } from "../../utils/signJwt";
import { verifyJwt } from "../../utils/verifyJwt";
import { Admin, IAdmin } from "../../models/Admin";
import { Response } from "express";
import {
  createAdminValidation,
  loginAdminValidation,
} from "../../validations/adminAuthValidations";

export const adminAuthResolver = {
  Query: {
    getAllAdmins: async () => {
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
    },
    authorizeAdmin: async (_: any, __: any, context: any) => {
      const { req, res }: { req: any; res: Response } = context;
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
      context: any
    ) => {
      const { res }: { res: Response } = context;

      const loginError = loginAdminValidation(email, password);
      if (loginError) {
        return {
          success: false,
          message: loginError,
        };
      }

      try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return {
            success: false,
            message: "Invalid email or password",
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

    createAdmin: async (
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
      const createAdminError = createAdminValidation(fullName, email, password);

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
    },

    changeAdminStatus: async (_: any, { email }: { email: string }) => {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return {
          success: false,
          message: "An error occurred while changing admin status",
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
    },

    changeAdminPassword: async (
      _: any,
      { email, newPassword }: { email: string; newPassword: string }
    ) => {
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
    },
  },
};
